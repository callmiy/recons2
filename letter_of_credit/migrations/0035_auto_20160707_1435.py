# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0034_auto_20160707_1425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='status',
            field=models.SmallIntegerField(verbose_name=b'Status', choices=[(0, b'CASH BACKED'), (1, b'MATURED OBLIGATION'), (2, b'LIQUIDITY FUNDING')]),
        ),
        migrations.AlterUniqueTogether(
            name='consolidatedlcbidrequest',
            unique_together=set([('mf', 'status')]),
        ),
    ]
