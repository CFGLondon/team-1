from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
import json


class AuthenticationViewTestCase(TestCase):

    client = Client()
    response = None

    def setUp(self):
        self.response = self.client.post("/auth/api/user/register/", {"username": "Heffalumps", "password": "Woozles", "email": "woozles@email.com", "location": "Dreamland"})

    def test_create_user_account(self):
        latest_account = User.objects.get(username="Heffalumps")
        self.assertEqual("Heffalumps", latest_account.username, "The username must be present in the database.")
        latest_user_profile = latest_account.userprofile
        self.assertEqual("Dreamland", latest_user_profile.location, "The location of the user must be present in the database.")

    def test_create_company_account(self):
        self.response = self.client.post("/auth/api/company/register/", {"username": "Company1", "password": "Woozles", "name": "JP Morgan", "company_type": "sample_type", "email": "woozles@email.com", "description": "Hello"})
        latest_account = User.objects.get(username="Company1")
        self.assertEqual("Company1", latest_account.username, "The username must be present in the database.")
        latest_company_profile = latest_account.companyprofile
        self.assertEqual("JP Morgan", latest_company_profile.name, "The company name must be present in the database.")

    def test_unauthorised_access(self):
        response = self.client.post("/auth/api/get_token/", {"username": "Mango", "password": "Apple"})
        self.assertEqual(response.status_code, 400, "There shouldn't be a token received.")

        response = self.client.post("/auth/api/authenticated/", {}, HTTP_AUTHORIZATION='JWT {}'.format("bad token"))
        self.assertEqual(response.status_code, 401, "There shouldn't be access granted.")

    def test_authorised_access(self):
        response = self.client.post("/auth/api/get_token/", {"username": "Heffalumps", "password": "Woozles"})
        self.assertEqual(response.status_code, 200, "The token should be successfully returned.")

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        response = self.client.post("/auth/api/authenticated/", {}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))

        self.assertTrue(response_content["authenticated"], "The user should be able to access this endpoint.")