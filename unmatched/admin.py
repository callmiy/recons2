from django.contrib import admin
from .models import UnmatchedClarec, TakenToMemo


class UnmatchedClarecAdmin(admin.ModelAdmin):
    list_display = (
        'valdate', 'post_date', 'amount_fmt', 'nostro', 'dr_cr', 'swift_flex',
        'clirec_detail_display', 'show', 'date_first_uploaded',
    )

    search_fields = (
        'details', 'amount', 'nostro__bank__swift_bic', 'nostro__name',
        'nostro__number',)

    def clirec_detail_display(self, obj):
        details = obj.details
        desired_len = 55
        if len(details) <= desired_len:
            return details
        return details[:desired_len] + '...'
    clirec_detail_display.short_description = 'Clirec Details'


class TakenToMemoAdmin(admin.ModelAdmin):
    list_display = ('date', 'amount', 'contra_acct', 'acct',)

    search_fields = ('amount', 'contra_acct__number', 'acct__number',)


admin.site.register(UnmatchedClarec, UnmatchedClarecAdmin)
admin.site.register(TakenToMemo, TakenToMemoAdmin)
