from django.contrib import admin
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from .models import UndrawnBal, SourceFx
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin


class UndrawnBalAdmin(AjaxSelectAdmin):

    form = make_ajax_form(
        UndrawnBal,
        {'estb_amt_ccy': 'ccy',
         'claim_amt_ccy': 'ccy',
         'surplus_amt_ccy': 'ccy',
         'customer': 'customer',
         'nostro': 'nostro_acct'})

    list_display = (
        'lc_number', 'customer', 'estb_amt_ccy', 'estb_amt',
        'claim_amt', 'surplus_amt_ccy', 'surplus_amt', 'date_cust_paid',)

    search_fileds = (
        'lc_number', 'customer__name', 'estb_amt', 'claim_amt', 'surplus_amt',)

    actions = ('print_refund_request', 'date_cust_paid')

    def print_refund_request(self, request, qs):
        selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        return HttpResponseRedirect(
            '%s?ids=%s' % (reverse('request-refund'), ','.join(selected)))
    print_refund_request.short_description = 'Print Refund Request Trops'


class SourceFxAdmin(admin.ModelAdmin):
    list_display = ('code', 'description',)
    search_fileds = ('code', 'description',)

# admin.site.register(UndrawnBal, UndrawnBalAdmin)
# admin.site.register(SourceFx, SourceFxAdmin)
