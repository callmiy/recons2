# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0028_auto_20160706_0918'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='rate',
            field=models.DecimalField(default=0, verbose_name=b'Rate', max_digits=15, decimal_places=8),
            preserve_default=False,
        ),
    ]
