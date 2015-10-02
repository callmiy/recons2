# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chgs', '0001_initial'),
        ('unmatched', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='charge',
            name='unmatched',
            field=models.ForeignKey(related_name='unmatched_chgs', blank=True, editable=False, to='unmatched.UnmatchedRecons', null=True),
        ),
    ]
