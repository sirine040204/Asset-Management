from django.db import transaction
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from .models import Company, CustomUser

signer = TimestampSigner()

def register_company_admin(data):
    with transaction.atomic():
        company = Company.objects.create(name=data['company_name'])
        
        user = CustomUser.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data['phone_number'],
            company=company,
            is_company_admin=True,
            is_approved=False
        )
        return user

def approve_company_admin(user_id):
    user = CustomUser.objects.get(id=user_id)
    if not user.is_company_admin:
        raise ValueError("User is not a company admin.")
    
    user.is_approved = True
    user.save()
    # TODO: Send notification email to the company admin
    return user

def invite_employee(company, data):
    with transaction.atomic():
        user = CustomUser.objects.create_user(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            company=company,
            role=data['role'],
            is_active=False # They need to activate and set password
        )
        
        token = signer.sign(user.email)
        # TODO: Send email with activation link (including token)
        return user, token

def activate_employee(token, password):
    try:
        # Token valid for 48 hours
        email = signer.unsign(token, max_age=48 * 3600)
    except (BadSignature, SignatureExpired):
        raise ValueError("Invalid or expired activation token.")

    user = CustomUser.objects.get(email=email)
    user.set_password(password)
    user.is_active = True
    user.save()
    return user
