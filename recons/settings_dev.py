import os


def my_project_config(project_dir, settings_dir):
    db_dir = os.path.join(project_dir, '..', 'database')
    not os.path.exists(db_dir) and os.mkdir(db_dir)

    db_path = os.path.join(db_dir, 'reconciliation.db')

    databases = {
        'default': {
            # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
            'ENGINE': 'django.db.backends.sqlite3',
            # Or path to database file if using sqlite3.
            'NAME': db_path,
        }
    }

    # Absolute filesystem path to the directory that will hold user-uploaded files.
    # Example: "/var/www/example.com/media/"
    media_path = os.path.join(project_dir, '..', 'media')
    not os.path.exists(media_path) and os.mkdir(media_path)

    log_dir = os.path.join(project_dir, '..', 'applogs')
    not os.path.exists(log_dir) and os.mkdir(log_dir)

    return dict(
            DEBUG=True,

            ADMINS=(('maneptha', 'maneptha@gmail.com'),),

            DATABASES=databases,

            ALLOWED_HOSTS=[],

            MEDIA_ROOT=media_path,

            LOG_DIR=log_dir,

            MEDIA_URL='/media/',

            STATIC_ROOT=os.path.join(project_dir, '..', 'static-files'),

            SECRET_KEY='+vbk$x)t5!ga*+$2#*6h8_#&#kc+$_1vt0z0u2%hn3-=p@c2c$',

            SESSION_COOKIE_NAME='recons_main_sessionid'
    )
