from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render_to_response
from django.template.context import RequestContext

@login_required
def user_delete(request, id):
    """ Make user inactive. We are not delete users! We make it inactive """
    pass

@login_required
def user_update(request, id):
    """ Update information about user """
    pass


@login_required
def user_list(request):
    """ Display users list """
    return render_to_response(
        'office/accounts/users/list.html',
        context_instance=RequestContext(request)
    )