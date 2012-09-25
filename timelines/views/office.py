import datetime

from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.utils import timezone

from timelines.models import Timeline


@login_required
def timeline_list(request):

    object_list = Timeline.objects.filter(deleted_at=None)

    if request.user.is_author:
        object_list = object_list.filter(created_by = request.user)
    else:
        object_list = object_list.all()

    return render_to_response(
        'office/timelines/list.html',
        {
            'object_list': object_list
        },
        context_instance=RequestContext(request)
    )

@login_required
def timeline_update_feed(request,id):
    """
    Timeline Update Feed
    """
    tl = Timeline.objects.get(pk=id)
    object_list = tl.update_feed()

    return render_to_response(
        'office/timelines/list.html',
        {
            'object_list': object_list
        },
        context_instance=RequestContext(request)
    )

@login_required
def timeline_rebuild_feed(request,id):
    """
    Timeline rebuild Feed
    """
    tl = Timeline.objects.get(pk=id)
    object_list = tl.rebuild_feed()

    return render_to_response(
        'office/timelines/list.html',
        {
            'object_list': object_list
        },
        context_instance=RequestContext(request)
    )

