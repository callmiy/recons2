from django.contrib import admin
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin
from letter_of_credit.models import FormM, FormMCover


@admin.register(FormM)
class FormMAdmin(AjaxSelectAdmin):
    form = make_ajax_form(FormM, {'applicant': 'customer', 'currency': 'ccy', 'lc': 'lc'})

    list_display = (
        'number', 'lc_number', 'applicant_name', 'currency', 'amount', 'date_received', 'goods_description',)

    search_fields = ('number', 'applicant__name', 'currency__code', 'amount', 'lc__lc_number')


@admin.register(FormMCover)
class FormMCoverAdmin(AjaxSelectAdmin):
    form = make_ajax_form(FormMCover, {'mf': 'form_m'})

    list_display = (
    'form_m_number', 'lc_number', 'applicant', 'currency', 'amount_formatted', 'cover_type', 'received_at',)

    search_fields = ('mf__number', 'cover_type', 'mf__applicant__name', 'mf__lc__lc_number')
