# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('unmatched', '0001_initial'),
        ('lcavail', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcavailed',
            name='unmatched',
            field=models.ForeignKey(related_name='unmatched_lcees', blank=True, editable=False, to='unmatched.UnmatchedRecons', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='lccovermovement',
            unique_together=set([('lc_number', 'acct', 'date_entry_passed', 'amount')]),
        ),
    ]
