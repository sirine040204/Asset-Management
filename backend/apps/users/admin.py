from django.contrib import admin
from .models import CustomUser, Company

admin.site.register(Company)
admin.site.register(CustomUser)
