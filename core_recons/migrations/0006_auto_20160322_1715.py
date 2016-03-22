# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('core_recons', '0005_fxdeal'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=300)),
                ('comment', models.TextField(null=True, blank=True)),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time created')),
                ('deleted_at', models.DateTimeField(null=True, verbose_name=b'Time deleted', blank=True)),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
            options={
                'db_table': 'attachment',
                'verbose_name': 'Attachment',
                'verbose_name_plural': 'Attachment',
            },
        ),
        migrations.CreateModel(
            name='AttachmentFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file', models.FileField(upload_to=b'attachments/%Y-%m-%d-%H-%S-%f')),
            ],
            options={
                'db_table': 'attachment_file',
                'verbose_name': 'Attachment File',
                'verbose_name_plural': 'Attachment File',
            },
        ),
        migrations.AddField(
            model_name='attachment',
            name='files',
            field=models.ManyToManyField(to='core_recons.AttachmentFile'),
        ),
    ]
