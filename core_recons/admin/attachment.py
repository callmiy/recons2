from django.contrib import admin
from core_recons.models import Attachment, AttachmentFile


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'comment', 'created_at', 'deleted_at', 'content_type', 'object_instance', 'files_names',)

    search_fields = ('title', 'comment',)


@admin.register(AttachmentFile)
class AttachmentFileAdmin(admin.ModelAdmin):
    list_display = ('file',)
