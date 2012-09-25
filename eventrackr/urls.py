from django.conf.urls import patterns, include, url
from tastypie.api import Api


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

v1_api = Api(api_name='v1')
from timelines.resources import TimelineResource
from events.resources import EventResource
from events.resources import ParentEventResource
from events.resources import CurrentEventResource
from services.resources import ServiceResource

v1_api.register(TimelineResource())
v1_api.register(ServiceResource())
v1_api.register(EventResource())
v1_api.register(CurrentEventResource())
v1_api.register(ParentEventResource())

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'eventrackr.views.home', name='home'),
    # url(r'^eventrackr/', include('eventrackr.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    # Login
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'office/login.html'}, name='login'),
    # Logout
    url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', name='logout'),

    # Office
    url(r'^office/', include('dashboard.urls.office')), # Dashboard
    url(r'^office/', include('accounts.urls.office')), # Accounts
    url(r'^office/', include('timelines.urls.office')), # Timelines
    url(r'^office/', include('events.urls.office')), # Events
    url(r'^office/', include('services.urls.office')), # Services
    url(r'^office/api/', include(v1_api.urls)), # API
    # Site
    # /


)

