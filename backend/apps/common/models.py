import uuid
from django.db import models
from django.conf import settings
from apps.users.models import Company

class EntityStatus:
    DRAFT = 'DRAFT'
    ACTIVE = 'ACTIVE'
    ARCHIVED = 'ARCHIVED'
    CANCELLED = 'CANCELLED'

    CHOICES = [
        (DRAFT, 'Brouillon'),
        (ACTIVE, 'Actif'),
        (ARCHIVED, 'Archivé'),
        (CANCELLED, 'Annulé'),
    ]

class EnterpriseBaseModel(models.Model):
    """
    Core base model for all enterprise entities.
    Enforces company isolation and standard fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='%(class)s_entities')
    
    code = models.CharField(max_length=50, blank=True, null=True, help_text="Code unique de l'entité")
    name = models.CharField(max_length=255)
    
    status = models.CharField(max_length=20, choices=EntityStatus.CHOICES, default=EntityStatus.ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='%(class)s_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='%(class)s_updated'
    )

    class Meta:
        abstract = True
        unique_together = (('company', 'code'),)

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name
