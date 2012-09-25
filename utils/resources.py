from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization

class ETAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        return True

    # Optional but recommended
    def get_identifier(self, request):
        return request.user.username

class ETAuthorization(Authorization):

    def is_authorized(self, request, object=None):
        return True
