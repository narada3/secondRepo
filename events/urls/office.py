from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^timelines/(?P<timeline_id>\d+)/events/$', 'events.views.office.event_list', name='office_event_list'),

)