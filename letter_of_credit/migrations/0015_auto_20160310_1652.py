# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0014_auto_20160305_1131'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lcissue',
            name='text',
            field=models.TextField(verbose_name=b'Issue Text'),
        ),
    ]
