from django.contrib import admin
from letter_of_credit.models import LetterOfCredit, LCRegister, FormM
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin


class LetterOfCreditAdmin(admin.ModelAdmin):
    pass


class LCRegisterAdmin(AjaxSelectAdmin):
    form = make_ajax_form(
        LCRegister, {'ccy_obj': 'currency', }
    )

    list_display = ('mf', 'ba', 'lc_number', 'applicant', 'acct_numb', 'ccy_obj',
                    'lc_amt_org_ccy_fmt', 'estb_date', 'expiry_date', 'bene', 'advising_bank', 'sector')

    list_display_links = ('mf', 'ba', 'lc_number',)

    search_fields = (
        'mf', 'ba', 'estb_date', 'lc_number', 'applicant', 'ccy_obj__code', 'acct_numb',
        'lc_amt_org_ccy', 'bene', 'advising_bank')

    def lc_amt_org_ccy_fmt(self, obj):
        return '{:,.2f}'.format(obj.lc_amt_org_ccy)

    lc_amt_org_ccy_fmt.short_description = 'FX Amount'


class FormMAdmin(admin.ModelAdmin):
    pass

admin.site.register(LetterOfCredit, LetterOfCreditAdmin)
admin.site.register(LCRegister, LCRegisterAdmin)
admin.site.register(FormM, FormMAdmin)
