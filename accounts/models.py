from django.contrib.auth.models import User
from django.db import models

# Account
class Account(User):
    class Meta:
        proxy = True

    # Sweat name
    def __unicode__(self):
        name = u""
        if len(self.first_name):
            name += u"%s " % self.first_name

        if len(self.last_name):
            name += u"%s " % self.last_name

        if not len(name):
            name = u"%s" % self.username

        return name

    # Check administrator privileges
    @property
    def is_administrator(self):
        if not hasattr(self, '_is_administrator'):
            self._is_administrator = bool(self.groups.filter(name__in=['Administrator']).values('name'))

        return self._is_administrator

    # Check editor privileges
    @property
    def is_editor(self):
        if not hasattr(self, '_is_editor'):
            self._is_editor = bool(self.groups.filter(name__in=['Editor']).values('name'))

        return self._is_editor

    # Check author privileges
    @property
    def is_author(self):
        if not hasattr(self, '_is_author'):
            self._is_author = bool(self.groups.filter(name__in=['Author']).values('name'))

        return self._is_author

    # Check Subscriber privileges
    @property
    def is_subscriber(self):
        if not hasattr(self, '_is_subscriber'):
            self._is_subscriber = bool(self.groups.filter(name__in=['Subscriber']).values('name'))

        return self._is_subscriber
