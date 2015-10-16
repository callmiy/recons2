from django.contrib import admin
from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete, LcBidRequest


class FormMAdmin(admin.ModelAdmin):
    list_display = (
        'number', 'lc_number', 'applicant_name', 'currency', 'amount', 'date_received', 'goods_description',)
    search_fields = ('number', 'applicant__name', 'currency__code', 'amount',)


class LCIssueAdmin(admin.ModelAdmin):
    pass


class LCIssueConcreteAdmin(admin.ModelAdmin):
    list_display = ('issue', 'lc_number', 'form_m_number', 'applicant', 'created_at', 'closed_at',)

    search_fields = ('mf__applicant__name', 'mf__number', 'issue__text')


class LcBidRequestAdmin(admin.ModelAdmin):
    list_display = ('form_m_number', 'applicant', 'currency', 'amount', 'goods_description',)
    search_fields = ('mf__number', 'mf__applicant__name', 'amount', 'mf__currency__code')


admin.site.register(FormM, FormMAdmin)
admin.site.register(LCIssue, LCIssueAdmin)
admin.site.register(LCIssueConcrete, LCIssueConcreteAdmin)
admin.site.register(LcBidRequest, LcBidRequestAdmin)
