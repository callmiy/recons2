# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0009_auto_20151103_0753'),
    ]

    operations = [
        migrations.AddField(
            model_name='formm',
            name='deleted_at',
            field=models.DateField(null=True, verbose_name=b'Date deleted', blank=True),
        ),
    ]
