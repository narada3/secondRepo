# Create your views here.
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.utils import timezone

@login_required
def home(request):
    return render_to_response(
        'home.html',
        {
        },
        context_instance=RequestContext(request)
    )
