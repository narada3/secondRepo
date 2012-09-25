from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    # Login
    url(r'^users/$', 'accounts.views.office.user_list', name='office_user_list'),
    url(r'^users/(\d+)/delete/$', 'accounts.views.office.user_delete', name='office_user_delete'),
    url(r'^users/(\d+)/update/$', 'accounts.views.office.user_update', name='office_user_update'),
)