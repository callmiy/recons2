import os


def my_project_config(PROJECT_DIR, SETTINGS_DIR):
    DB_DIR = os.path.join(PROJECT_DIR, '..', 'database')
    not os.path.exists(DB_DIR) and os.mkdir(DB_DIR)

    DB_PATH = os.path.join(DB_DIR, 'reconciliation.db')

    DATABASES = {
        'default': {
            # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
            'ENGINE': 'django.db.backends.sqlite3',
            # Or path to database file if using sqlite3.
            'NAME': DB_PATH,
        }
    }

    media_path = os.path.join(PROJECT_DIR, '..', 'media')
    not os.path.exists(media_path) and os.mkdir(media_path)

    return dict(
        DEBUG=True,

        ADMINS=(('maneptha', 'maneptha@gmail.com'),),

        DATABASES=DATABASES,

        ALLOWED_HOSTS=[],

        MEDIA_ROOT=media_path,

        MEDIA_URL='/media/',

        STATIC_ROOT=os.path.join(PROJECT_DIR, '..', 'static-files'),

        SECRET_KEY='+vbk$x)t5!ga*+$2#*6h8_#&#kc+$_1vt0z0u2%hn3-=p@c2c$',

        SESSION_COOKIE_NAME='recons_main_sessionid'
    )
