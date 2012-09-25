from django.db.models import Q
from django.utils import timezone

from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.paginator import Paginator

from utils.resources import ETAuthentication, ETAuthorization
from models import Event

class ParentEventResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'parent_events'
        allowed_methods = ['get']
        authentication = ETAuthentication()
        authorization = ETAuthorization()
        filtering = {
            "timeline": ('exact',),
        }

    def get_object_list(self, request):
        return super(ParentEventResource, self).get_object_list(request).filter(deleted_at=None).filter(
            parent__isnull=True).filter(service__isnull=True)


class EventResource(ModelResource):
    timeline = fields.ForeignKey('timelines.resources.TimelineResource', 'timeline', full=True)
    parent = fields.ForeignKey('self', 'parent', null=True, blank=True)

    class Meta:
        queryset = Event.objects.all()
        resource_name = 'events'
        allowed_methods = ['get', 'post', 'put', 'delete']
        paginator_class = Paginator
        authentication = ETAuthentication()
        authorization = ETAuthorization()
        filtering = {
            "timeline": ('exact',),
            "parent": ('exact',),
            "type": ('exact',),
        }

    def obj_create(self, bundle, request=None, **kwargs):
        if bundle.data['parent'] == '':
            bundle.data['parent'] = None
        return super(EventResource, self).obj_create(bundle, request, created_by=request.user, updated_by=request.user)

    def obj_update(self, bundle, request=None, **kwargs):
        if bundle.data['parent'] == '':
            bundle.data['parent'] = None
        return super(EventResource, self).obj_update(bundle, request, **kwargs)

    def obj_delete(self, request=None, **kwargs):
        pk = kwargs['pk']
        obj = Event.objects.get(pk=pk)
        obj.deleted_at = timezone.now()
        obj.deleted_by = request.user
        obj.save()

    def get_object_list(self, request):
        return super(EventResource, self).get_object_list(request).filter(deleted_at=None)

    def dehydrate(self, bundle):
        if bundle.obj.service == None:
            bundle.data['type'] = 'EVENT'
        else:
            bundle.data['type'] = bundle.obj.service.type
        return bundle


class CurrentEventResource(ModelResource):
    timeline = fields.ForeignKey('timelines.resources.TimelineResource', 'timeline', full=True)

    class Meta:
        queryset = Event.objects.all()
        resource_name = 'current_events'
        allowed_methods = ['get']
        authentication = ETAuthentication()
        authorization = ETAuthorization()
        filtering = {
            "timeline": ('exact',),
        }

    def get_object_list(self, request):
        return super(CurrentEventResource, self).get_object_list(request).filter(deleted_at=None).filter(
            service=None).filter(date_start__lte=timezone.now()).filter(date_end__gt=timezone.now())

    def dehydrate(self, bundle):
        if bundle.obj.service == None:
            bundle.data['type'] = 'EVENT'
        else:
            bundle.data['type'] = bundle.obj.service.type
        return bundle

