from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponse
import json

from django.contrib.auth.models import User
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = User.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            User.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, format=None):
        data = request.data

        username = data.get('username', None)
        password = data.get('password', None)

        account = authenticate(username=username, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class RestrictedView(APIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def post(self, request):

        # If the user can access this view, that means the user is authenticated
        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')

