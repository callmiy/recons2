# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0011_auto_20151216_1922'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcbidrequest',
            name='maturity',
            field=models.DateField(null=True, verbose_name=b'Maturity Date', blank=True),
        ),
    ]
