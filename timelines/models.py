import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from accounts.models import Account

class Timeline(models.Model):
    title = models.CharField(max_length=100, verbose_name=_(u"Title"))
    date_start = models.DateTimeField(verbose_name=_(u"Date Start"))
    date_end = models.DateTimeField(verbose_name=_(u"Date End"))
    description = models.TextField(verbose_name=_(u"Description"), null=True, blank=True)

    spam_items = models.IntegerField(verbose_name=_(u'spam_items'), null=True, blank=True)
    spam_time = models.IntegerField(verbose_name=_(u'spam_time'), null=True, blank=True)

    published_at = models.DateTimeField(verbose_name=_(u"Published Date"), null=True, blank=True)
    published_by = models.ForeignKey(Account, verbose_name=_(u"Published By"), null=True, blank=True, related_name="published_by")
    created_by = models.ForeignKey(Account, verbose_name=_(u"Created By"), related_name='timeline_created_by')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_(u"Created Date"), editable=False)
    updated_by = models.ForeignKey(Account, verbose_name=_(u"Updated By"), related_name='timeline_updated_by')
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_(u"Updated Date"))
    deleted_by = models.ForeignKey(Account, verbose_name=_(u"Deleted By"), related_name='timeline_deleted_by', null=True, blank=True, default=None)
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name=_(u"Deleted Date"))

    livestream_account = models.CharField(max_length=100, verbose_name=_(u"Livestream Account"), blank=True, null=True)
    livestream_active = models.BooleanField(verbose_name=_(u"Livestream Active"), default = False)

    chatroll_account = models.CharField(max_length=100, verbose_name=_(u"Chatroll Account"), blank=True, null=True)
    chatroll_active = models.BooleanField(verbose_name=_(u"Chatroll Active"), default = False)

    class Meta:
        ordering = ['-date_start']

    def update_feed(self):
        for service in self.services.all().filter(deleted_at=None):
            service.start_update_feed()

    def rebuild_feed(self):
        for service in self.services.all().filter(deleted_at=None):
            service.rebuild_feed()

