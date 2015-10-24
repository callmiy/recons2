from django.contrib import admin
from letter_of_credit.models import LcBidRequest


@admin.register(LcBidRequest)
class LcBidRequestAdmin(admin.ModelAdmin):
    list_display = ('form_m_number', 'applicant', 'currency', 'amount', 'goods_description',)
    search_fields = ('mf__number', 'mf__applicant__name', 'amount', 'mf__currency__code')
