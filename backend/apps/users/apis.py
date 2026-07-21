from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import (
    CompanyAdminRegistrationSerializer,
    EmployeeInviteSerializer,
    EmployeeActivationSerializer,
    UserSerializer,
    CompanySerializer
)
from . import services
from .models import CustomUser

class RegisterCompanyAdminAPI(APIView):
    def post(self, request):
        serializer = CompanyAdminRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = services.register_company_admin(serializer.validated_data)
            return Response(
                {"message": "Registration successful. Pending admin approval.", "user_id": user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApproveCompanyAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = services.approve_company_admin(pk)
            return Response({"message": f"User {user.email} has been approved."})
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InviteEmployeeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_company_admin or not request.user.is_approved:
            return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = EmployeeInviteSerializer(data=request.data)
        if serializer.is_valid():
            user, token = services.invite_employee(request.user.company, serializer.validated_data)
            return Response(
                {
                    "message": "Employee invited successfully.", 
                    "activation_token": token # For testing/MVP purposes we return the token
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateEmployeeAPI(APIView):
    def post(self, request):
        serializer = EmployeeActivationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                services.activate_employee(
                    serializer.validated_data['token'],
                    serializer.validated_data['password']
                )
                return Response({"message": "Account activated successfully."})
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
