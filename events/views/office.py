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
from events.models import Event

@login_required
def event_list(request, timeline_id):
    timeline = Timeline.objects.get(pk=timeline_id)
    object_list = Event.objects.filter(timeline=timeline_id, deleted_at=None)

    return render_to_response(
        'office/events/list.html',
        {
            'object_list': object_list,
            'timeline': timeline
        },
        context_instance=RequestContext(request)
    )
