from django.db import models
from django.utils.translation import ugettext_lazy as _

from accounts.models import Account
from timelines.models import Timeline

class Event(models.Model):
    #All
    timeline = models.ForeignKey(Timeline, verbose_name=_(u"Timeline"), null=True, blank=True)
    title = models.CharField(verbose_name=_(u'Title'), max_length=100)
    description = models.CharField(verbose_name=_(u'Description'), max_length=100)   #?????? No
    content_text = models.CharField(verbose_name=_(u'Content'), max_length=500)
    content_picture = models.FileField(verbose_name=_(u"Picture"), null=True, blank=True, upload_to="events/%Y/%m/%d")
    # To Twitter date_start=date_end= Publish Date
    # To Flickr date_start= date_taken date_end= fate publish
    date_start = models.DateTimeField(verbose_name=_(u"Date Start"))
    date_end = models.DateTimeField(verbose_name=_(u"Date End"))

    #Only Post
    service = models.ForeignKey('services.Service', verbose_name=_(u"Service"), null=True, blank=True, related_name='events')
    content_media_url = models.URLField(verbose_name=_(u'Media content url'))
    content_media_type = models.CharField(verbose_name=_(u'Media type'), max_length=20)
    id_in_feed = models.CharField(verbose_name=_(u'ID'), max_length=20)

    #Only Event
    parent = models.ForeignKey('self', blank=True, null=True, verbose_name="Parent", related_name='children')

    #All
    created_by = models.ForeignKey(Account, verbose_name=_(u"Created By"), related_name='created_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_(u"Created Date"), editable=False, null=True, blank=True)
    updated_by = models.ForeignKey(Account, verbose_name=_(u"Updated By"), related_name='updated_by', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_(u"Updated Date"), null=True, blank=True)
    deleted_by = models.ForeignKey(Account, verbose_name=_(u"Deleted By"), related_name='deleted_by', null=True, blank=True)
    deleted_at = models.DateTimeField(verbose_name=_(u"Deleted Date"), null=True, blank=True)

    class Meta:
        ordering = ['-date_start']