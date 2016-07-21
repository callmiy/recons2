from django.contrib import admin
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin

from letter_of_credit.models import TreasuryAllocation


@admin.register(TreasuryAllocation)
class TreasuryAllocationAdmin(AjaxSelectAdmin):
    form = make_ajax_form(TreasuryAllocation, {
        'consolidated_bids': 'consolidated_bid',
    })

    list_display = (
        'deal_number', 'deal_date', 'settlement_date', 'transaction_type', 'customer_name_no_ref', 'ref', 'currency',
        'fcy_amount_formatted', 'naira_rate',
    )
    search_fields = ('deal_number', 'deal_date', 'settlement_date', 'transaction_type', 'customer_name', 'currency',
                     'fcy_amount', 'naira_rate')
