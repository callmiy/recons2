from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.db import models
from core_recons.utilities import get_generic_related_model_class_str
import re

FILE_NAME_RE = re.compile(r'attachments/\d{4}-\d{2}-\d{2}/(.+)')


class AttachmentFile(models.Model):
    file = models.FileField(upload_to='attachments/%Y-%m-%d', max_length=300, )

    class Meta:
        db_table = 'attachment_file'
        verbose_name = 'Attachment File'
        verbose_name_plural = 'Attachment File'
        app_label = 'core_recons'

    def __unicode__(self):
        return reverse('download-attachment-file', kwargs={'pk': self.pk})

    def download_url(self):
        return self.__unicode__()

    def name(self):
        return FILE_NAME_RE.search(self.file.name).group(1)


class Attachment(models.Model):
    title = models.CharField(max_length=300, )
    comment = models.TextField(null=True, blank=True, )
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object_instance = GenericForeignKey('content_type', 'object_id')
    files = models.ManyToManyField(AttachmentFile)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Time created')
    deleted_at = models.DateTimeField('Time deleted', null=True, blank=True)

    class Meta:
        db_table = 'attachment'
        verbose_name = 'Attachment'
        verbose_name_plural = 'Attachment'
        app_label = 'core_recons'

    def file_download_uri(self):
        return [the_file.__unicode__() for the_file in self.files.all()]

    def file_names(self):
        return [the_file.name() for the_file in self.files.all()]

    def related_model_class_str(self):
        return get_generic_related_model_class_str(self)
