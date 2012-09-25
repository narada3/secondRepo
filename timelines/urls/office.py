from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^timelines/$', 'timelines.views.office.timeline_list', name='office_timeline_list'),

    url(r'^timelines/(\d+)/update/feed/$', 'timelines.views.office.timeline_update_feed', name='office_timeline_update_feed'),
    url(r'^timelines/(\d+)/rebuild/feed/$', 'timelines.views.office.timeline_rebuild_feed', name='office_timeline_rebuild_feed'),

)