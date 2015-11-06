# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name=b'Text')),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time created')),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
            options={
                'db_table': 'comment',
            },
        ),
        migrations.CreateModel(
            name='CommentHistory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time created')),
                ('deleted_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time deleted', null=True)),
                ('comment', models.ForeignKey(related_name='histories', verbose_name=b'Related Comment', to='core_recons.Comment')),
            ],
            options={
                'db_table': 'comment_history',
                'verbose_name': 'Comment History',
                'verbose_name_plural': 'Comment History',
            },
        ),
    ]
