from authentication.views import RestrictedView, UserView, CompanyView
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^api/user/register/$', UserView.as_view(), name='register_user'),
    url(r'^api/company/register/$', CompanyView.as_view(), name='register_company'),
    url(r'^api/get_token/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^api/authenticated/$', RestrictedView.as_view(), name='test_token'),
    url(r'^admin/', include(admin.site.urls)),
)
