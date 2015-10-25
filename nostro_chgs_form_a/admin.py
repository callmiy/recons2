from django.contrib import admin
from .models import NostroChgsFormA
from ajax_select import make_ajax_form


class NostroChgsFormAAdmin(admin.ModelAdmin):
    form = make_ajax_form(
        NostroChgsFormA, {'acct': 'nostro_acct'}
    )

    list_display = (
        'swift_ref',
        'form_a_ref',
        'amount_fmt',
        'acct',
        'completion_date',
        'approved_by'
    )

# admin.site.register(NostroChgsFormA, NostroChgsFormAAdmin)
