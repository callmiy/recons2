# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountnumber',
            name='currency',
            field=models.ForeignKey(related_name='acct_numb_currencies', default=9, to='adhocmodels.Currency'),
            preserve_default=False,
        ),
    ]
