# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0016_lccommission'),
    ]

    operations = [
        migrations.AddField(
            model_name='lccommission',
            name='comment',
            field=models.TextField(null=True, verbose_name=b'Event', blank=True),
        ),
    ]
