# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0031_auto_20160707_1339'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='object_id',
        ),
    ]
