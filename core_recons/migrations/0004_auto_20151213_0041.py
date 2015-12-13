# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('core_recons', '0003_auto_20151106_1216'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 13, 0, 41, 23, 139000), verbose_name=b'Time updated', auto_now=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='commenthistory',
            name='comment',
            field=models.ForeignKey(related_name='comment_histories', on_delete=django.db.models.deletion.PROTECT, verbose_name=b'Related Comment', to='core_recons.Comment'),
        ),
    ]
