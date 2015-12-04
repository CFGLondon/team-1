from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
import json


class AuthenticationViewTestCase(TestCase):

    client = Client()
    response = None

    def setUp(self):
        self.response = self.client.post("/auth/api/accounts/", {"username": "Heffalumps", "password": "Woozles", "email": "woozles@email.com"})

    def test_create_account(self):
        response_content = json.loads(self.response.content.decode('utf-8'))
        self.assertEqual("Heffalumps", response_content["username"], "Response should contain the username.")
        self.assertEqual("Woozles", response_content["password"], "Response should contain the password.")

        latest_account = User.objects.latest('date_joined')
        self.assertEqual("Heffalumps", latest_account.username, "The username must be present in the database.")
        self.assertEqual("woozles@email.com", latest_account.email, "The email must be present in the database.")

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