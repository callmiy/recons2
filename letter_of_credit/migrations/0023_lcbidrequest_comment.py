# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0022_auto_20160621_0326'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcbidrequest',
            name='comment',
            field=models.TextField(null=True, verbose_name=b'Comment', blank=True),
        ),
    ]
