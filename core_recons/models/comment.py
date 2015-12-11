from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Comment(models.Model):
    text = models.TextField('Text')
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object_instance = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Time created')
    deleted_at = models.DateTimeField('Time deleted', null=True, blank=True)

    class Meta:
        db_table = 'comment'
        app_label = 'core_recons'

    def __unicode__(self):
        return '[%s | %s]' % (self.content_type, self.short_comment())

    def short_comment(self):
        return self.text[:30]


class CommentHistory(models.Model):
    comment = models.ForeignKey(Comment, verbose_name='Related Comment', related_name='comment_histories',
                                on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Time created')
    deleted_at = models.DateTimeField('Time deleted', null=True, blank=True)
    text = models.TextField('Text')
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object_instance = GenericForeignKey('content_type', 'object_id')

    class Meta:
        db_table = 'comment_history'
        verbose_name = 'Comment History'
        verbose_name_plural = 'Comment History'
        app_label = 'core_recons'
