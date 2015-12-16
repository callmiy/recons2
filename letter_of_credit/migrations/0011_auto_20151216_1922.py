# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0010_formm_deleted_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lcregister',
            name='lc_number',
            field=models.CharField(max_length=16, verbose_name=b'LC Number'),
        ),
    ]
