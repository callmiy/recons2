# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0037_auto_20160707_2223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='allocations',
            field=models.TextField(default=b'{}', verbose_name=b'Allocation mapping from ID to amount for this bid'),
        ),
    ]
