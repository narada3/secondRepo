import datetime
from time import mktime

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.utils import timezone

import tweepy
from eventrackr import flickrapi
from eventrackr import feedparser
import atom
import gdata.youtube
import gdata.youtube.service

from accounts.models import Account
from timelines.models import Timeline
from events.models import Event

class Service(models.Model):
    FACEBOOK = 'FACEBOOK'
    TWITTER = 'TWITTER'
    YOUTUBE = 'YOUTUBE'
    FLICKR = 'FLICKR'
    BLOGS = 'BLOGS'

    TYPE_CHOICES = (
        (FACEBOOK, 'Facebook'),
        (TWITTER, 'Twitter'),
        (YOUTUBE, 'Youtube'),
        (FLICKR, 'Flickr'),
        (BLOGS, 'Blogs'),
        )

    timeline = models.ForeignKey(Timeline, verbose_name=_(u"Timeline"), related_name='services')
    title = models.CharField(max_length=100, verbose_name=_(u"Title"))
    type = models.CharField(verbose_name=_(u'Type'), default=TWITTER, max_length=100)
    date_start = models.DateTimeField(verbose_name=_(u"Date Start"))
    date_end = models.DateTimeField(verbose_name=_(u"Date End"))
    last_update_at = models.DateTimeField(blank=True, null=True, verbose_name=_(u"Last Update Date"))

    url = models.CharField(verbose_name=_(u'URL'), max_length=100, null=True, blank=True)
    login = models.CharField(verbose_name=_(u'Login'), max_length=100, null=True, blank=True)
    password = models.CharField(verbose_name=_(u'Password'), max_length=100, null=True, blank=True)

    #Twitter
    twitter_access_token_key = models.CharField(verbose_name=_(u'twitter_username'), max_length=100, null=True,
        blank=True)
    twitter_access_token_secret = models.CharField(verbose_name=_(u'twitter_username'), max_length=100, null=True,
        blank=True)
    twitter_username = models.CharField(verbose_name=_(u'twitter_username'), max_length=100, null=True, blank=True)
    twitter_keyword = models.CharField(verbose_name=_(u'twitter_keyword'), max_length=100, null=True, blank=True)
    twitter_hashtag = models.CharField(verbose_name=_(u'twitter_include_followers'), max_length=100, null=True,
        blank=True)
    twitter_include_followers = models.BooleanField(verbose_name=_(u'twitter_include_followers'), default=False)

    #Flickr
    flickr_api_key = models.CharField(verbose_name=_(u'flickr_api_key'), max_length=50, null=True, blank=True)
    flickr_api_secret = models.CharField(verbose_name=_(u'flickr_api_secret'), max_length=50, null=True, blank=True)
    flickr_user_id = models.CharField(verbose_name=_(u'flickr_user_id'), max_length=20, null=True, blank=True)
    flickr_photoset_id = models.CharField(verbose_name=_(u'flickr_photoset_id'), max_length=20, null=True, blank=True)

    #Youtube
    youtube_playlist_url = models.CharField(verbose_name=_(u'youtube playlist url'), max_length=50, null=True, blank=True)

    #Facebook
    #...

    created_by = models.ForeignKey(Account, verbose_name=_(u"Created By"), related_name='service_created_by')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_(u"Created Date"), editable=False)
    updated_by = models.ForeignKey(Account, verbose_name=_(u"Updated By"), related_name='service_updated_by')
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_(u"Updated Date"))
    deleted_by = models.ForeignKey(Account, verbose_name=_(u"Deleted By"), related_name='service_deleted_by', null=True,
        blank=True, default=None)
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name=_(u"Deleted Date"))

    class Meta:
        ordering = ['title']

    def __unicode__(self):
        return '%s - %s' % (self.type, self.title)


    def start_update_feed(self):
        print '111111111111111111111111111'
        if self.last_update_at == None:
            if self.date_start <= timezone.now():
                self.update_feed(self.date_start, self.date_end)
                self.last_update_at = timezone.now()
                self.save()
        elif (self.date_end >= timezone.now()):
            self.update_feed( self.last_update_at, self.date_end)
            self.last_update_at = timezone.now()
            self.save()
        else:
            if self.last_update_at < self.date_end:
                self.update_feed(self.last_update_at, self.date_end)
                self.last_update_at = timezone.now()
                self.save()
        return range

    def update_feed(self, dstart, dend):
        kind = self.type
        if kind == 'TWITTER':
            self.update_feed_twitter(dstart, dend)
        elif kind == 'YOUTUBE':
            self.update_feed_youtube(dstart, dend)
        elif kind == 'FLICKR':
            self.update_feed_flickr(dstart, dend)
        elif kind == 'FACEBOOK':
            self.update_feed_facebook(dstart, dend)
        elif kind == 'BLOGS':
            self.update_feed_blogs(dstart, dend)
        else:
            pass

    def update_feed_twitter(self, dstart, dend):
        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_ACCESS_TOKEN_KEY, settings.TWITTER_ACCESS_TOKEN_SECRET)
        api = tweepy.API(auth)
        if self.twitter_include_followers:
            twitter_timeline = api.home_timeline()
        else:
            twitter_timeline = api.user_timeline()
        date_start_naive = timezone.make_naive(dstart, timezone.utc)
        date_end_naive = timezone.make_naive(dend, timezone.utc)
        for tweet in twitter_timeline:
            tweet_date = tweet.created_at
            if (tweet_date >= date_start_naive) and ( tweet_date <= date_end_naive):
            #if (tweet_date >= self.date_start) and ( tweet_date <= self.date_end):
                user = tweepy.API(auth).get_user(tweet.author.id)
                post = Event(service=self, timeline=self.timeline)
                post.id_in_feed = tweet.id_str
                post.date_start = tweet.created_at
                post.date_end = tweet.created_at
                post.title = '%s @%s' % (user.name, user.screen_name)
                post.content_text = tweet.text
                post.content_media_url = user.profile_image_url
                post.content_media_type = 'image'
                post.description = ''
                post.save()

    def update_feed_facebook(self, dstart, dend):
        pass

    def update_feed_flickr(self, dstart, dend):
        #self.flickr_user_id
        #flickr = flickrapi.FlickrAPI(self.flickr_api_key, self.flickr_api_secret)
        #photos = flickr.walk_set(self.flickr_photoset_id, extras='updated_at')
        flickr = flickrapi.FlickrAPI(settings.FLICKR_API_KEY, settings.FLICKR_API_SECRET)
        #photos = flickr.people_getPublicPhotos(user_id=settings.FLICKR_USER_ID, extras='date_upload, date_taken')
        photos = flickr.walk_set('72157631568437333', extras='date_upload, date_taken')
        for photo in photos:
            photo_posted_at = photo.get('dateupload')
            photo_taken_at = photo.get('datetaken')
            photo_id = photo.get('id')
            photo_title = photo.get('title')
            photo_farm = photo.get('farm')
            photo_server = photo.get('server')
            photo_secret = photo.get('secret')
            photo_url = 'http://farm%s.staticflickr.com/%s/%s_%s.jpg' % (
            photo_farm, photo_server, photo_id, photo_secret )

            post = Event(service=self, timeline=self.timeline)
            post.id_in_feed = photo_id
            post.date_start = datetime.datetime.strptime(photo_taken_at, '%Y-%m-%d %H:%M:%S')
            post.date_end = datetime.datetime.fromtimestamp(int(photo_posted_at))
            post.title = photo_title
            post.content_text = ''
            post.content_media_url = photo_url
            post.content_media_type = 'image'
            post.description = ''
            post.save()

    def update_feed_youtube(self, dstart, dend):
        pass


    def update_feed_blogs(self, dstart, dend):
        #url
        #self.date_start
        #self.Date_end
        #self.url
        #url = 'http://www.rkblog.rk.edu.pl/w/rss/'
        #url = 'http://www.pixelcom.crimea.ua/feed'
        #url = 'http://surfniels.blogspot.com/feeds/posts/default?alt=rss'
        print '--------------------------------'
        d = feedparser.parse(self.url)
        for item in d['items']:
            item_date = datetime.datetime.fromtimestamp(mktime(item.published_parsed))
            print item.title
            if (item_date >= dstart) and ( item_date <= dend):
                post = Event(service=self, timeline=self.timeline)
                post.id_in_feed = item.id
                post.id_in_feed = ''
                #post.author = item.author
                post.date_start = item_date
                post.date_end = item_date
                post.title = item.title
                post.content_text = item.summary
                post.content_media_url = ''
                post.content_media_type = ''
                post.description = ''
                post.save()


    def rebuild_feed(self):
        for ev in self.events.all():
            ev.delete()
        last_update_at = None
        self.start_update_feed()
