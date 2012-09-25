from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    # Login
    url(r'^dashboard/$', 'dashboard.views.dashboard', name='office_dashboard'),
)