# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0045_lcbidrequest_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='rate',
            field=models.CharField(max_length=200, null=True, verbose_name=b'Rate', blank=True),
        ),
    ]
