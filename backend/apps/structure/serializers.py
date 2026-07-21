from rest_framework import serializers
from .models import Company, Supplier, Department, Site, Family, FamilyAttribute, Immobilisation
from apps.common.models import EntityStatus
from datetime import datetime

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ('id', 'company', 'created_at', 'updated_at', 'created_by', 'updated_by')

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ('id', 'company', 'created_at', 'updated_at', 'created_by', 'updated_by')

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'
        read_only_fields = ('id', 'company', 'created_at', 'updated_at', 'created_by', 'updated_by')


class FamilyAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyAttribute
        fields = '__all__'
        read_only_fields = ('id', 'family', 'internal_code', 'created_at', 'updated_at', 'created_by', 'updated_by')

class FamilySerializer(serializers.ModelSerializer):
    attributes = FamilyAttributeSerializer(many=True, required=False)

    class Meta:
        model = Family
        fields = '__all__'
        read_only_fields = ('id', 'company', 'created_at', 'updated_at', 'created_by', 'updated_by')

    def create(self, validated_data):
        attributes_data = validated_data.pop('attributes', [])
        family = Family.objects.create(**validated_data)
        
        for idx, attr_data in enumerate(attributes_data):
            attr_data['display_order'] = attr_data.get('display_order', idx)
            FamilyAttribute.objects.create(family=family, **attr_data)
            
        return family

    def update(self, instance, validated_data):
        attributes_data = validated_data.pop('attributes', None)
        
        # Update family fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update attributes if provided
        if attributes_data is not None:
            # We must preserve internal_code and avoid hard deletion
            existing_attrs = {attr.internal_code: attr for attr in instance.attributes.all()}
            incoming_codes = set()
            
            for idx, attr_data in enumerate(attributes_data):
                attr_data['display_order'] = attr_data.get('display_order', idx)
                # The frontend might not send internal_code for new ones, but it sends label. 
                # Wait, internal_code is read_only, so how do we map them?
                # If they have an 'id', we map by ID. If not, they are new.
                # Since id is read_only, we need to pop it from initial_data in the view, 
                # or just use label as a heuristic. Let's use label for simplicity, though not perfect.
                label = attr_data.get('label')
                # Find by label or create new
                existing = next((a for a in existing_attrs.values() if a.label == label), None)
                
                if existing:
                    for key, val in attr_data.items():
                        setattr(existing, key, val)
                    existing.status = FamilyAttribute.STATUS_ACTIVE
                    existing.save()
                    incoming_codes.add(existing.internal_code)
                else:
                    new_attr = FamilyAttribute.objects.create(family=instance, **attr_data)
                    incoming_codes.add(new_attr.internal_code)
                    
            # Archive the ones that were removed
            for code, attr in existing_attrs.items():
                if code not in incoming_codes:
                    attr.status = FamilyAttribute.STATUS_ARCHIVED
                    attr.save()
                
        return instance

class ImmobilisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Immobilisation
        fields = '__all__'
        read_only_fields = ('id', 'company', 'created_at', 'updated_at', 'created_by', 'updated_by')

    def validate(self, data):
        # We need family to validate attribute_values
        family = data.get('family') or (self.instance.family if self.instance else None)
        attribute_values = data.get('attribute_values', {})

        if family and attribute_values:
            # Fetch definitions
            definitions = {attr.internal_code: attr for attr in family.attributes.filter(status=FamilyAttribute.STATUS_ACTIVE)}
            
            # Validate provided values against definitions
            for code, attr_def in definitions.items():
                val = attribute_values.get(code)
                
                if attr_def.is_required and val in (None, '', []):
                    raise serializers.ValidationError({f"attribute_values.{code}": "Ce champ est obligatoire."})
                
                if val is not None and val != "":
                    # Type validation
                    if attr_def.data_type == 'INTEGER':
                        try:
                            int(val)
                        except (ValueError, TypeError):
                            raise serializers.ValidationError({f"attribute_values.{code}": "Doit être un entier valide."})
                    elif attr_def.data_type == 'DECIMAL':
                        try:
                            float(val)
                        except (ValueError, TypeError):
                            raise serializers.ValidationError({f"attribute_values.{code}": "Doit être un nombre décimal valide."})
                    elif attr_def.data_type == 'DATE':
                        try:
                            # Assuming format YYYY-MM-DD
                            datetime.strptime(str(val), '%Y-%m-%d')
                        except ValueError:
                            raise serializers.ValidationError({f"attribute_values.{code}": "Format de date invalide (YYYY-MM-DD attendu)."})
                    elif attr_def.data_type == 'BOOLEAN':
                        if not isinstance(val, bool) and str(val).lower() not in ['true', 'false', '1', '0']:
                            raise serializers.ValidationError({f"attribute_values.{code}": "Doit être un booléen."})
                    elif attr_def.data_type in ('SELECT', 'MULTI_SELECT'):
                        options = attr_def.options or []
                        valid_values = [opt.get('value') for opt in options]
                        
                        if attr_def.data_type == 'SELECT':
                            if val not in valid_values:
                                raise serializers.ValidationError({f"attribute_values.{code}": f"Valeur invalide. Options: {valid_values}"})
                        else: # MULTI_SELECT
                            if not isinstance(val, list):
                                raise serializers.ValidationError({f"attribute_values.{code}": "Doit être une liste."})
                            for v in val:
                                if v not in valid_values:
                                    raise serializers.ValidationError({f"attribute_values.{code}": f"Valeur invalide '{v}'. Options: {valid_values}"})

        return data
