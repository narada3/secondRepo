from django import template
from django.core.urlresolvers import reverse, get_urlconf, get_resolver

register = template.Library()

@register.simple_tag
def menu_active_item(request, viewname):
    import re

    urlconf = get_urlconf()
    resolver = get_resolver(urlconf)
    pattern = resolver.reverse_dict[viewname][1]

    if re.search(pattern, request.path):
        return 'active'
    return ''
