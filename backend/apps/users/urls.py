from django.urls import path
from .apis import (
    RegisterCompanyAdminAPI,
    ApproveCompanyAdminAPI,
    InviteEmployeeAPI,
    ActivateEmployeeAPI,
)

urlpatterns = [
    # Registration & Auth
    path('register/', RegisterCompanyAdminAPI.as_view(), name='register_company_admin'),
    # Login will be handled by simplejwt later or via another endpoint
    
    # Employee Management
    path('employees/invite/', InviteEmployeeAPI.as_view(), name='invite_employee'),
    path('employees/activate/', ActivateEmployeeAPI.as_view(), name='activate_employee'),

    # Super Admin Operations
    path('admin/companies/<int:pk>/approve/', ApproveCompanyAdminAPI.as_view(), name='approve_company_admin'),
]
