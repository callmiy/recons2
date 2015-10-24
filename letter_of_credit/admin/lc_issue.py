from django.contrib import admin
from letter_of_credit.models import LCIssue, LCIssueConcrete


@admin.register(LCIssue)
class LCIssueAdmin(admin.ModelAdmin):
    list_display = ('text',)

    search_fields = ('text',)


@admin.register(LCIssueConcrete)
class LCIssueConcreteAdmin(admin.ModelAdmin):
    list_display = ('issue', 'lc_number', 'form_m_number', 'applicant', 'created_at', 'closed_at',)

    search_fields = ('mf__applicant__name', 'mf__number', 'issue__text')
