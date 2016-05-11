# coding:utf-8
import os
from datetime import date
from .settings_dev import my_project_config

SETTINGS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.split(SETTINGS_DIR)[0]

project_config = my_project_config(PROJECT_DIR, SETTINGS_DIR)

DEBUG = project_config['DEBUG']
TEMPLATE_DEBUG = DEBUG

ADMINS = project_config['ADMINS']

MANAGERS = ADMINS
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 60 * 60 * 12  # 12 hours

DATABASES = project_config['DATABASES']

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = project_config['ALLOWED_HOSTS']

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Africa/Lagos'  # 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

MEDIA_ROOT = project_config['MEDIA_ROOT']

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = project_config['MEDIA_URL']

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
if 'STATIC_ROOT' in project_config:
    STATIC_ROOT = project_config['STATIC_ROOT']

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.CachedStaticFilesStorage'

# Additional locations of static files
STATICFILES_DIRS = (
    # <editor-fold description=''>
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    # </editor-fold>
    os.path.join(SETTINGS_DIR, 'static'),
    os.path.join(PROJECT_DIR, 'bower_components'),
    os.path.join(PROJECT_DIR, 'app'),
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = project_config['SECRET_KEY']

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    # 'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    # <editor-fold description=''>
    # 'core_recons.middleware.RequestLoggingMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # </editor-fold>
)

SESSION_COOKIE_NAME = project_config['SESSION_COOKIE_NAME']

ROOT_URLCONF = 'recons.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'recons.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or
    # "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(SETTINGS_DIR, 'templates'),
    os.path.join(PROJECT_DIR, 'app'),
)

INSTALLED_APPS = (
    # <editor-fold description=''>
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'django_behave',
    'ajax_select',
    'django_extensions',
    'rest_framework',
    "adhocmodels",
    "postentry",
    "ibdint",
    "chgs",
    "lcavail",
    "rateupload",
    'unmatched',
    'undrawnbal',
    'nostro_chgs_form_a',
    'letter_of_credit',
    'contingent_report',
    'core_recons',
    'bdd',
    # </editor-fold>
)

TEST_RUNNER = 'django_behave.runner.DjangoBehaveTestSuiteRunner'

from recons.logging import get_logging_config

LOGGING = get_logging_config(project_config['LOG_DIR'])

from ajax_lookup_channels import ajax_lookup_channels

AJAX_LOOKUP_CHANNELS = ajax_lookup_channels

APPEND_SLASH = False

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}
