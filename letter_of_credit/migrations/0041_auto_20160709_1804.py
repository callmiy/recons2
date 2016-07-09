# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0040_auto_20160709_1759'),
    ]

    operations = [
        migrations.AlterField(
            model_name='treasuryallocation',
            name='distribution_to_consolidated_bids',
            field=models.TextField(null=True, verbose_name=b'Mapping from ID to amount distributed to a consolidated bid object', blank=True),
        ),
    ]
