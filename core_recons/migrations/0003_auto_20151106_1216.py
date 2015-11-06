# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('core_recons', '0002_auto_20151103_2026'),
    ]

    operations = [
        migrations.AddField(
            model_name='commenthistory',
            name='content_type',
            field=models.ForeignKey(default=None, to='contenttypes.ContentType'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='commenthistory',
            name='object_id',
            field=models.PositiveIntegerField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='commenthistory',
            name='text',
            field=models.TextField(default=None, verbose_name=b'Text'),
            preserve_default=False,
        ),
    ]
