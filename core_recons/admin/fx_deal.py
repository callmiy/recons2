from django.contrib import admin
from core_recons.models import FxDeal


@admin.register(FxDeal)
class FxDealAdmin(admin.ModelAdmin):
    list_display = (
        'deal_number', 'currency', 'allocated_on', 'amount_allocated', 'utilized_on', 'amount_utilized', 'content_type',
        'object_instance',)

    list_display_links = ('deal_number', 'currency', 'allocated_on', 'amount_allocated')

    search_fields = (
    'deal_number', 'currency__code', 'allocated_on', 'amount_allocated', 'utilized_on', 'amount_utilized',)


# @admin.register(LcBidRequestFxDealManager)
# class LcBidRequestFxDealManagerAdmin(admin.ModelAdmin):
#     list_display = (
#         'deal_number', 'currency', 'allocated_on', 'amount_allocated', 'utilized_on', 'amount_utilized', 'content_type',
#         'object_instance',)
#
#     list_display_links = ('deal_number', 'currency', 'allocated_on', 'amount_allocated')
#
#     search_fields = (
#     'deal_number', 'currency__code', 'allocated_on', 'amount_allocated', 'utilized_on', 'amount_utilized',)
