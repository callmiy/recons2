# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0032_auto_20160707_1355'),
    ]

    operations = [
        migrations.AddField(
            model_name='consolidatedlcbidrequest',
            name='bid_requests',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
