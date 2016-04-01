from django.contrib import admin
from adhocmodels import models
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin


class BranchAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name',)


class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name',)


class OverseasBankAdmin(admin.ModelAdmin):
    list_display = ('swift_bic', 'name')
    search_fields = ('swift_bic', 'name',)


class RelationshipManagerAdmin(AjaxSelectAdmin):
    form = make_ajax_form(models.RelationshipManager, {'branch': 'branch'})

    list_display = ('name', 'rmcode', 'branch',)
    search_fields = ('name', 'rmcode', 'branch__code',)


class AccountNumberAdmin(AjaxSelectAdmin):
    form = make_ajax_form(models.AccountNumber, {'owner': 'customer', 'branch': 'branch', 'currency': 'ccy'})

    list_display = ('nuban', 'currency', 'owner', 'branch', 'acct_id', 'description',)

    search_fields = (
        'nuban', 'owner__name', 'branch__name', 'branch__code', 'old_numb', 'acct_id', 'currency__code', 'description',
    )


class CustomerAdmin(AjaxSelectAdmin):
    form = make_ajax_form(models.Customer, {'branch_for_itf': 'branch', 'parent': 'customer', 'rel_manager': 'rm'})

    list_display = ('name', 'rman', 'branch_for_itf', 'subsidiary_status',)
    search_fields = ('name',)


class NostroAccountAdmin(AjaxSelectAdmin):
    form = make_ajax_form(
            models.NostroAccount,
            {'bank': 'overseas_bank', 'ccy': 'ccy'})

    list_display = ('number', 'currency', 'bank', 'name',)
    search_fields = (
        'bank__name', 'bank__swift_bic', 'ccy__code', 'number', 'name',)

    def currency(self, obj):
        return obj.ccy.code


class LedgerAccountAdmin(AjaxSelectAdmin):
    form = make_ajax_form(
            models.LedgerAccount,
            {'external_number': 'nostro_acct',
             'ccy': 'ccy',
             })

    list_display = (
        'number', 'currency', 'acct_type_display', 'external_number', 'name')

    search_fields = (
        'number', 'acct_type__code', 'acct_type__description',
        'external_number__number', 'ccy__code', 'name', 'external_number__name')


class ValidTransactionRefAdmin(admin.ModelAdmin):
    list_display = ('valid_ref_start',)
    search_fields = ('valid_ref_start',)


class LedgerAccountTypeAdmin(admin.ModelAdmin):
    list_display = ('code', 'description',)
    search_fields = ('code', 'description',)


admin.site.register(models.Branch, BranchAdmin)
admin.site.register(models.Currency, CurrencyAdmin)
admin.site.register(models.OverseasBank, OverseasBankAdmin)
admin.site.register(models.RelationshipManager, RelationshipManagerAdmin)
admin.site.register(models.AccountNumber, AccountNumberAdmin)
admin.site.register(models.Customer, CustomerAdmin)
admin.site.register(models.NostroAccount, NostroAccountAdmin)
admin.site.register(models.LedgerAccount, LedgerAccountAdmin)
admin.site.register(models.ValidTransactionRef, ValidTransactionRefAdmin)
admin.site.register(models.LedgerAccountType, LedgerAccountTypeAdmin)
