from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend

from .models import Company, Supplier, Department, Site, Family, FamilyAttribute, Immobilisation
from apps.common.models import EntityStatus
from .serializers import (
    SupplierSerializer, DepartmentSerializer, SiteSerializer,
    FamilySerializer, FamilyAttributeSerializer, ImmobilisationSerializer
)

class CompanyScopedViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet that automatically filters by the user's company
    and assigns created_by/updated_by and company on creation.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        user = self.request.user
        if not user.company:
            return self.queryset.none()
        return self.queryset.filter(company=user.company)

    def perform_create(self, serializer):
        user = self.request.user
        if not user.company:
            raise PermissionDenied("Vous devez être associé à une entreprise.")
        
        serializer.save(
            company=user.company,
            created_by=user,
            updated_by=user
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class SupplierViewSet(CompanyScopedViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    search_fields = ['name', 'code']

class DepartmentViewSet(CompanyScopedViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    search_fields = ['name', 'code']

class SiteViewSet(CompanyScopedViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    search_fields = ['name', 'code']

class FamilyViewSet(CompanyScopedViewSet):
    queryset = Family.objects.prefetch_related('attributes').all()
    serializer_class = FamilySerializer
    search_fields = ['name', 'code', 'description']
    filterset_fields = ['status']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def perform_destroy(self, instance):
        # Archive instead of physical deletion
        instance.status = EntityStatus.ARCHIVED
        instance.save()

class ImmobilisationViewSet(CompanyScopedViewSet):
    queryset = Immobilisation.objects.select_related('family', 'supplier', 'department', 'site', 'responsible_person').all()
    serializer_class = ImmobilisationSerializer
    search_fields = ['code', 'name', 'serial_number']
    filterset_fields = ['status', 'family', 'department', 'site']
    ordering_fields = ['code', 'name', 'purchase_date']
    ordering = ['code']

    def perform_destroy(self, instance):
        # Archive instead of physical deletion
        instance.status = EntityStatus.ARCHIVED
        instance.save()
