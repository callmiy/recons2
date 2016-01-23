# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0012_lcbidrequest_maturity'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='uploadedformm',
            unique_together=set([('ba', 'mf', 'ccy', 'validity_type', 'status')]),
        ),
        migrations.RemoveField(
            model_name='uploadedformm',
            name='validated_at',
        ),
    ]
