import os
from django.conf import global_settings

# Django settings for eventrackr project.
from django.core.urlresolvers import reverse

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT_DIR = os.path.dirname(__file__)

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'test.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/media/"
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), "media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = os.path.join(os.path.dirname(__file__), "static")

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # os.path.join(PROJECT_ROOT_DIR, 'static'),
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
    'compressor.finders.CompressorFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'df9^s!l!g7$yzmqe(2$-b6qc-q*@+p@6t@qfqxxw-)_6(uzcsz'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'eventrackr.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'eventrackr.wsgi.application'

TEMPLATE_CONTEXT_PROCESSORS = global_settings.TEMPLATE_CONTEXT_PROCESSORS + ('django.core.context_processors.request',)

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(PROJECT_ROOT_DIR, "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    # 'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',

    'utils',
    'accounts',
    'dashboard',
    'timelines',
    'events',
    'services',

    'south',
    'social_auth',
    'compressor',

    'tastypie',

    )

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
# In settings_local.py you can overwrite any default settings
# settings.py usage only for production configuration
try:
    from settings_local import *
except ImportError:
    pass

# South users should add this rule to enable migrations:
try:
    import south
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^social_auth\.fields\.JSONField"])
except:
    pass


LOGIN_REDIRECT_URL = reverse('office_dashboard')
LOGIN_URL = reverse('login')

AUTHENTICATION_BACKENDS =  (
    'accounts.auth_backends.AccountModelBackend',
)

CUSTOM_USER_MODEL = 'accounts.Account'

# Compressor configuration
COMPRESS_PRECOMPILERS = (
    ('text/coffeescript',   'coffee --compile --stdio'),
    ('text/less',           'lessc {infile} {outfile}'),
    ('text/x-sass',         'sass {infile} {outfile}'),
    ('text/x-scss',         'sass --scss {infile} {outfile}'),
)
# Compressor output directory
COMPRESS_OUTPUT_DIR = 'cache'

"""
#Dev Server
TWITTER_CONSUMER_KEY = "stKTtgNlhCKXnoB5Sa1XKQ"
TWITTER_CONSUMER_SECRET = "uoHTbe8PW7imWXnKIldVlRrCwm0NiqDG7YzEAUPy0"
TWITTER_ACCESS_TOKEN_KEY = "18433423-U2CcYL4nR22vnBM8K4DTkWJLGyRbPyB0aTIMmOzqw"
TWITTER_ACCESS_TOKEN_SECRET = "eA8pDmfa09Y245ByzUEchBStSIehhNEe8N8vJAxke9M"
"""


#Local Server
TWITTER_CONSUMER_KEY = "dF1jMNx91NIFbFUfT4e3w"
TWITTER_CONSUMER_SECRET = "xn51ZGZevPNXUSzTVJE0wvuF51wnJp6NThXckj47TEM"
TWITTER_ACCESS_TOKEN_KEY = "18433423-Ngdp958nLvFrbSouIu6M7KML4r2759wXYAVXvQl4b"
TWITTER_ACCESS_TOKEN_SECRET = "sXwXhPyUzsU0brIxM45FnWkRgVTrwvQLejT5UxkHrU"

#Temp
FACEBOOK_APP_ID = "282886511745514"
FACEBOOK_APP_SECRET = "85a5fcbfdf23aa8760a99dbc4b37e678"
FACEBOOK_APP_TOKEN = "282886511745514|pKcOArKbPqo5FG19sYOuDQbEG9U"
FACEBOOK_USER_TOKEN = "AAAEBSKYLWeoBADdmVyvLtWtpaFSfcu805tBh70f5aE01LdlcHRjTDlvZAgZBTKB3M7BYymfAqwyWBxmaaZBRZBEZBDXv8WuE1zAiXNBQu08zLz22ItKE8"


FLICKR_API_KEY = '65b80ce96804e3376962384d44756e3e'
FLICKR_API_SECRET = 'e47d7b1f3f708938'
FLICKR_USER_ID = '45867011@N00'

YOUTUBE_DEV_KEY = "AI39si7m40VRKqXDCXXrFu3cH3KTlgIeoJNDV9gGk36p9v-3uVIeMEYAxdeEo4Q1SqubbU4S6oMCQ86D4PmFgUPq-AS-FJ5j9Q"
YOUTUBE_EMAIL = 'coldhawaii2010@gmail.com'
YOUTUBE_PASSWORD = 'coldhawaiiall2010'
