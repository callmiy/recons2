from django.contrib import admin

from letter_of_credit.models import LcCommission


@admin.register(LcCommission)
class LcCommissionAdmin(admin.ModelAdmin):
    list_display = (
        'lc_number', 'applicant', 'charge_date', 'ccy_code', 'transaction_amount_formatted', 'charge_amount_formatted',
        'percent_applied', 'exchange_rate', 'acct_numb', 'event', 'created_at',)

    search_fields = ('lc__lc_number', 'transaction_amount', 'charge_amount', 'exchange_rate', 'percent_applied',
                     'acct_numb', 'event', 'comment', 'charge_date', 'created_at', 'lc__applicant', 'lc__ccy_obj__code',
                     'lc__mf',)
