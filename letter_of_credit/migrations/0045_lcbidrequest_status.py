# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0044_auto_20160710_1022'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcbidrequest',
            name='status',
            field=models.SmallIntegerField(default=0, verbose_name=b'Status', choices=[(0, b'CASH BACKED'), (1, b'MATURED OBLIGATION'), (2, b'LIQUIDITY FUNDING')]),
        ),
    ]
