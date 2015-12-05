from django.shortcuts import render

# Create your views here.

from rest_framework import permissions
from rest_framework.views import APIView
from django.http.response import HttpResponse
import json
from jobapp.models import UserProfile, CompanyProfile, Job

class MockJobView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request):
        description = request.POST.get("description", None)
        type = request.POST.get("type", None)
        division = request.POST.get("division", None)
        location = request.POST.get("location", None)
        timestamp = request.POST.get("timestamp", None)

        Job.objects.create(
            description=description,
            type=type,
            division=division,
            location=location,
            timestamp=timestamp
        )

        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')