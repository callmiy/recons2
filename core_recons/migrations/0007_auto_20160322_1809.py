# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core_recons', '0006_auto_20160322_1715'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachmentfile',
            name='file',
            field=models.FileField(max_length=300, upload_to=b'attachments/%Y-%m-%d'),
        ),
    ]
