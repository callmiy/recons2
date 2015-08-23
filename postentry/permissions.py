import sys
import os

sys.path.insert(0, '..')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recons.settings')

from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from postentry.models import Entry


def create_perms_for_entry():
    perms = (
        ('can_create_adhoc_post', 'Can create adhoc postings',),
    )
    content_type = ContentType.objects.get_for_model(Entry)

    for codename, name in perms:
        if not Permission.objects.filter(
                codename=codename, name=name, content_type=content_type).exists():
            Permission.objects.create(codename=codename,
                                      name=name,
                                      content_type=content_type)
create_perms_for_entry()
