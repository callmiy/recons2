# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0002_accountnumber_currency'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountnumber',
            name='description',
            field=models.CharField(max_length=300, null=True, verbose_name=b'Description', blank=True),
        ),
    ]
