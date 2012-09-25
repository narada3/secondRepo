from django.db.models import Q
from django.utils import timezone

from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.paginator import Paginator

from utils.resources import ETAuthentication, ETAuthorization
from models import Service

class ServiceResource(ModelResource):
    timeline = fields.ForeignKey('timelines.resources.TimelineResource', 'timeline', full=True)

    class Meta:
        queryset = Service.objects.all()
        resource_name = 'services'
        allowed_methods = ['get', 'post', 'put', 'delete']
        paginator_class = Paginator
        authentication = ETAuthentication()
        authorization = ETAuthorization()
        filtering = {
            "timeline": ('exact',),
        }

    def obj_create(self, bundle, request=None, **kwargs):
        print bundle.data
        return super(ServiceResource, self).obj_create(bundle, request, created_by=request.user, updated_by=request.user)

    def obj_update(self, bundle, request=None, **kwargs):
        return super(ServiceResource, self).obj_update(bundle, request, **kwargs)

    def obj_delete(self, request=None, **kwargs):
        pk = kwargs['pk']
        obj = Service.objects.get(pk=pk)
        obj.deleted_at = timezone.now()
        obj.deleted_by = request.user
        obj.save()

    def get_object_list(self, request):
        return super(ServiceResource, self).get_object_list(request).filter(deleted_at=None)

