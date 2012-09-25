import json

from django.db.models import Q
from django.utils import timezone

from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.paginator import Paginator

from utils.resources import ETAuthentication, ETAuthorization
from models import Timeline
#from events.resources import EventResource

class TimelineResource(ModelResource):
    class Meta:
        queryset = Timeline.objects.all()
        resource_name = 'timelines'
        allowed_methods = ['get', 'post', 'put', 'delete']
        paginator_class = Paginator
        authentication = ETAuthentication()
        authorization = ETAuthorization()

    def obj_create(self, bundle, request=None, **kwargs):
        return super(TimelineResource, self).obj_create(bundle, request, user=request.user,
            created_by=bundle.request.user, updated_by=bundle.request.user)

    def obj_delete(self, request=None, **kwargs):
        pk = kwargs['pk']
        obj = Timeline.objects.get(pk=pk)
        obj.deleted_at = timezone.now()
        obj.deleted_by = request.user
        obj.save()

    def get_object_list(self, request):
        if request.user.is_author:
            return super(TimelineResource, self).get_object_list(request).filter(created_by=request.user).filter(
                deleted_at=None)
        else:
            return super(TimelineResource, self).get_object_list(request).filter(deleted_at=None)

