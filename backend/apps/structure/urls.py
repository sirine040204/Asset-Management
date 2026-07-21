from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, DepartmentViewSet, SiteViewSet, FamilyViewSet, ImmobilisationViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'sites', SiteViewSet)
router.register(r'families', FamilyViewSet)
router.register(r'immobilisations', ImmobilisationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
