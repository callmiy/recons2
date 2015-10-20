# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0003_uploadedformm'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcregister',
            name='mt_730_received_at',
            field=models.DateField(null=True, verbose_name=b'MT 730 Received', blank=True),
        ),
    ]
