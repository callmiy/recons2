from datetime import date
import os


def get_logging_config(log_dir):
    # A sample logging configuration. The only tangible logging
    # performed by this configuration is to send an email to
    # the site admins on every HTTP 500 error when DEBUG=False.
    # See http://docs.djangoproject.com/en/dev/topics/logging for
    # more details on how to customize your logging configuration.

    return {
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
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': os.path.join(log_dir, '%s-recons.log' % date.today()),
                'maxBytes': 1024*1024*5,
                'backupCount': 5000,
                'delay': True,
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
