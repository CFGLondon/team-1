from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.http.response import HttpResponse
import json
from django.contrib.auth.models import User
from jobapp.models import UserProfile, CompanyProfile


class UserView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        username = request.POST.get("username", None)
        password = request.POST.get("password", None)
        location = request.POST.get("location", None)

        user = User.objects.create_user(
                 username=username,
                 password=password)

        user_profile = UserProfile.objects.create(location=location, user=user)

        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')


class CompanyView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        username = request.POST.get("username", None)
        password = request.POST.get("password", None)
        name = request.POST.get("name", None)
        description = request.POST.get("description", None)
        company_type = request.POST.get("company_type", None)

        user = User.objects.create_user(
                 username=username,
                 password=password)

        company_profile = CompanyProfile.objects.create(name=name, description=description, company_type=company_type, user=user)

        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')

class RestrictedView(APIView):

    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def post(self, request):

        # If the user can access this view, that means the user is authenticated
        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')

