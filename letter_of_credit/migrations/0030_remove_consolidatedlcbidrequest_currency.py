# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0029_auto_20160707_0334'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='currency',
        ),
    ]
