# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core_recons', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='deleted_at',
            field=models.DateTimeField(null=True, verbose_name=b'Time deleted', blank=True),
        ),
        migrations.AlterField(
            model_name='commenthistory',
            name='comment',
            field=models.ForeignKey(related_name='histories', on_delete=django.db.models.deletion.PROTECT, verbose_name=b'Related Comment', to='core_recons.Comment'),
        ),
        migrations.AlterField(
            model_name='commenthistory',
            name='deleted_at',
            field=models.DateTimeField(null=True, verbose_name=b'Time deleted', blank=True),
        ),
    ]
