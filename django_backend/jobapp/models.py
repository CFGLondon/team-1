from django.db import models

from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    location = models.CharField(max_length=100)

    def __unicode__(self):
        return '{0}'.format(self.id)

    class Meta():
        db_table = 'tbl_user_profile'


class CompanyProfile(models.Model):
    user = models.OneToOneField(User)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    company_type = models.CharField(max_length=100)

    def __unicode__(self):
        return '{0}'.format(self.id)

    class Meta():
        db_table = 'tbl_company_profile'


class Job(models.Model):

    company_profile = models.ForeignKey(CompanyProfile, related_name='company_profile')

    description = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    division = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    timestamp = models.CharField(max_length=100)

    def __unicode__(self):
        return '{0}'.format(self.id)

    class Meta():
        db_table = 'tbl_job'
