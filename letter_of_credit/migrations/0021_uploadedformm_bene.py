# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0020_lcregister_os_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='uploadedformm',
            name='bene',
            field=models.CharField(default='', max_length=300, verbose_name=b'Beneficiary'),
            preserve_default=False,
        ),
    ]
