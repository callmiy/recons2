# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0023_lcbidrequest_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcbidrequest',
            name='docs_complete',
            field=models.BooleanField(default=False, verbose_name=b'Documentation Complete'),
        ),
    ]
