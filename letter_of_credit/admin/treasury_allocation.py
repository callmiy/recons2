from django.contrib import admin

from letter_of_credit.models import TreasuryAllocation


@admin.register(TreasuryAllocation)
class TreasuryAllocationAdmin(admin.ModelAdmin):
    list_display = (
        'deal_number', 'deal_date', 'settlement_date', 'transaction_type', 'customer_name_no_ref', 'ref', 'currency',
        'fcy_amount_formatted', 'naira_rate', 'original_request',
    )
    search_fields = ('deal_number', 'deal_date', 'settlement_date', 'transaction_type', 'customer_name', 'currency',
                     'fcy_amount', 'naira_rate')
