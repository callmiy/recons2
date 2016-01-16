from django.contrib import admin
from .fx_deal import FxDealAdmin
from core_recons.models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text', 'content_type', 'object_instance',)
    search_fields = ('text',)
