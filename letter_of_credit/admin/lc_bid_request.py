from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin
from django.contrib import admin

from letter_of_credit.models import LcBidRequest, ConsolidatedLcBidRequest


@admin.register(LcBidRequest)
class LcBidRequestAdmin(admin.ModelAdmin):
    list_display = (
        'form_m_number', 'applicant', 'currency', 'amount', 'goods_description', 'rate', 'bid_letter',
        'credit_approval', 'requested_at', 'downloaded', 'comment', 'docs_complete',)
    search_fields = ('mf__number', 'mf__applicant__name', 'amount', 'mf__currency__code', 'comment', 'requested_at',)


@admin.register(ConsolidatedLcBidRequest)
class ConsolidatedLcBidRequestAdmin(AjaxSelectAdmin):
    form = make_ajax_form(ConsolidatedLcBidRequest, {'mf': 'form_m'})

    list_display = (
        'form_m_number', 'customer_name', 'currency', 'amount',)

    search_fields = ('mf__number', 'mf__applicant__name', 'mf__lc__lc_number', 'amount', 'mf__amount',)
