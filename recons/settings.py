# coding:utf-8
import os
from datetime import date

SETTINGS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.split(SETTINGS_DIR)[0]

DB_DIR = os.path.join(PROJECT_DIR, '..', 'database')
not os.path.exists(DB_DIR) and os.mkdir(DB_DIR)

DB_PATH = os.path.join(DB_DIR, 'reconciliation.db')

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (('maneptha', 'maneptha@gmail.com'),)

MANAGERS = ADMINS
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_AGE = 60 * 60 * 12  # 12 hours

DATABASES = {
    'default': {
        # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.sqlite3',
        # Or path to database file if using sqlite3.
        'NAME': DB_PATH,
    }
}
# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['foreignops-hp', 'localhost', ]

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
media_path = os.path.join(PROJECT_DIR, '..', 'media')
not os.path.exists(media_path) and os.mkdir(media_path)

MEDIA_ROOT = media_path

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = '/media/'

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = os.path.join(PROJECT_DIR, '..', 'static-files')

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
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '+vbk$x)t5!ga*+$2#*6h8_#&#kc+$_1vt0z0u2%hn3-=p@c2c$'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    # 'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    # <editor-fold description=''>
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # </editor-fold>
)

SESSION_COOKIE_NAME = 'recons_main_sessionid'

ROOT_URLCONF = 'recons.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'recons.wsgi.application'

TEMPLATE_DIRS = (
    # Put strings here, like "/home/html/django_templates" or
    # "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(SETTINGS_DIR, 'templates'),
)

INSTALLED_APPS = (
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
    'payment',
    'core_recons',
    'bdd',
)

TEST_RUNNERx = ''

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
    'formatters': {
        'verbose': {
            'format': """\n%(asctime)s\nPATH: %(pathname)s\nFunction: %(funcName)s\n%(message)s\n"""
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '../%s-recons.log' % date.today(),
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'recons_logger': {
            'handlers': ('file',),
            'level': 'INFO'
        }
    }
}

AJAX_LOOKUP_CHANNELS = {
    # <editor-fold description=''>
    'ledger_memo_cash': ('adhocmodels.lookups', 'LedgerMemoCashLookup'),

    'nostro_acct': ('adhocmodels.lookups', 'NostroAccountLookup'),

    'customer': ('adhocmodels.lookups', 'CustomerLookup'),

    'overseas_bank': ('adhocmodels.lookups', 'OverseasBankLookup'),

    'ccy': ('adhocmodels.lookups', 'CurrencyLookup'),

    'ledger': ('adhocmodels.lookups', 'LedgerAcctLookup'),

    'branch': ('adhocmodels.lookups', 'BranchLookup'),

    'rm': ('adhocmodels.lookups', 'RelationshipManagerLookup'),

    'ti_posting_status_customer_debit': ('contingent_report.lookups', 'TIPostingStatusReportCustomerDebitLookup'),

    'currency': ('adhocmodels.lookups', 'CurrencyLookup'),
    # </editor-fold>
}

APPEND_SLASH = False

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}
