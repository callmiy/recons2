# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0026_auto_20160703_1815'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='treasuryallocation',
            options={'verbose_name': 'Treasury Allocation', 'verbose_name_plural': ('Treasury Allocation',)},
        ),
        migrations.AlterUniqueTogether(
            name='treasuryallocation',
            unique_together=set([('deal_number', 'deal_date', 'transaction_type')]),
        ),
    ]
