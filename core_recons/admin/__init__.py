from django.contrib import admin
from core_recons.models import Comment, CommentHistory


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text',  'content_type', 'object_instance',)
    search_fields = ('text',)
