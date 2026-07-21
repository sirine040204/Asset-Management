import uuid
from django.db import models
from django.conf import settings
from decimal import Decimal
from apps.users.models import Company
from apps.common.models import EnterpriseBaseModel, EntityStatus


class Supplier(EnterpriseBaseModel):
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        unique_together = ('company', 'name')
        # code is unique together with company in base model

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name


class Department(EnterpriseBaseModel):
    class Meta:
        unique_together = ('company', 'name')

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name


class Site(EnterpriseBaseModel):
    address = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('company', 'name')

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name


class Family(EnterpriseBaseModel):
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        unique_together = ('company', 'name')
        verbose_name_plural = 'Families'

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name


class FamilyAttribute(models.Model):
    STATUS_ACTIVE = 'ACTIVE'
    STATUS_ARCHIVED = 'ARCHIVED'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Actif'),
        (STATUS_ARCHIVED, 'Archivé'),
    ]

    DATA_TYPE_CHOICES = [
        ('TEXT', 'Texte court'),
        ('TEXTAREA', 'Texte long'),
        ('INTEGER', 'Nombre entier'),
        ('DECIMAL', 'Nombre décimal'),
        ('DATE', 'Date'),
        ('BOOLEAN', 'Case à cocher (Oui/Non)'),
        ('EMAIL', 'Email'),
        ('PHONE', 'Téléphone'),
        ('URL', 'Lien Web'),
        ('SELECT', 'Sélection unique'),
        ('MULTI_SELECT', 'Sélection multiple'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name='attributes')
    label = models.CharField(max_length=255)
    internal_code = models.SlugField(max_length=255, editable=False) # Immutable and independent
    data_type = models.CharField(max_length=20, choices=DATA_TYPE_CHOICES)
    is_required = models.BooleanField(default=False)
    placeholder = models.CharField(max_length=255, blank=True, null=True)
    help_text = models.CharField(max_length=255, blank=True, null=True)
    default_value = models.CharField(max_length=255, blank=True, null=True)
    options = models.JSONField(blank=True, null=True, help_text="For SELECT/MULTI_SELECT. Format: [{'label': 'X', 'value': 'y'}]")
    validation_rules = models.JSONField(blank=True, null=True, help_text="Custom validation rules like min/max length, regex, etc.")
    display_order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('family', 'internal_code')
        ordering = ['display_order']

    def save(self, *args, **kwargs):
        if not self.internal_code and self.label:
            from django.utils.text import slugify
            base_code = slugify(self.label).replace('-', '_')
            code = base_code
            counter = 1
            while FamilyAttribute.objects.filter(family=self.family, internal_code=code).exists():
                code = f"{base_code}_{counter}"
                counter += 1
            self.internal_code = code
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.label} ({self.internal_code})"


class Immobilisation(EnterpriseBaseModel):
    # inventory_number conceptually is 'code' from base model, 
    # but to avoid breaking changes we map it to code logically or keep it.
    # We'll use base model's 'code' for inventory number logically.
    family = models.ForeignKey(Family, on_delete=models.PROTECT, related_name='immobilisations')
    
    description = models.TextField(blank=True, null=True)
    
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, blank=True, null=True)
    responsible_person = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='responsible_for')
    
    purchase_date = models.DateField(blank=True, null=True)
    commissioning_date = models.DateField(blank=True, null=True)
    purchase_price = models.DecimalField(max_digits=12, decimal_places=3, default=Decimal("0.000"))
    warranty_end = models.DateField(blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Store dynamic family attributes
    attribute_values = models.JSONField(default=dict, blank=True)

    class Meta:
        # Code is unique per company from base model, which acts as inventory_number
        pass

    def __str__(self):
        return f"[{self.code}] {self.name}" if self.code else self.name
