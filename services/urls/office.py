from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^timelines/(?P<timeline_id>\d+)/services/$', 'services.views.office.service_list', name='office_service_list'),

)