from ajax_select import LookupChannel
from .models import (
    LedgerAccount,
    NostroAccount,
    Customer,
    OverseasBank,
    Currency,
    Branch,
    RelationshipManager)
from django.db.models import Q


class RelationshipManagerLookup(LookupChannel):

    model = RelationshipManager

    def get_query(self, q, request):
        return RelationshipManager.objects.filter(
            Q(name__icontains=q) |
            Q(rmcode__icontains=q) |
            Q(branch__code__contains=q)
        )


class BranchLookup(LookupChannel):

    model = Branch

    def get_query(self, q, request):
        return Branch.objects.filter(
            Q(code__contains=q) | Q(name__icontains=q)
        )


class LedgerMemoCashLookup(LookupChannel):

    model = LedgerAccount
    min_length = 3
    plugin_options = {
        'minLength': 3
    }

    def get_query(self, q, request):
        return LedgerAccount.objects.filter(
            acct_type__code__exact='MCSH', number__icontains=q)

    def can_add(self, user, argmodel):
        return True


class NostroAccountLookup(LookupChannel):

    model = NostroAccount
    min_length = 4
    plugin_options = {
        'minLength': 4
    }

    def get_query(self, q, request):
        return NostroAccount.objects.exclude(
            number__contains='UNKNOWN'
        ).filter(
            Q(number__icontains=q) |
            Q(bank__swift_bic__icontains=q) |
            Q(name__icontains=q)
        )


class CustomerLookup(LookupChannel):

    model = Customer
    min_length = 3
    plugin_options = {
        'minLength': 3
    }

    def get_query(self, q, request):
        return Customer.objects.filter(name__icontains=q)


class OverseasBankLookup(LookupChannel):

    model = OverseasBank
    min_length = 3
    plugin_options = {
        'minLength': 3
    }

    def get_query(self, q, request):
        return OverseasBank.objects.filter(
            Q(name__icontains=q) |
            Q(swift_bic__icontains=q)
        )


class CurrencyLookup(LookupChannel):

    model = Currency
    min_length = 2
    plugin_options = {
        'minLength': 2
    }

    def get_query(self, q, request):
        return Currency.objects.filter(
            Q(code__icontains=q) |
            Q(name__icontains=q)
        )


class LedgerAcctLookup(LookupChannel):

    model = LedgerAccount
    min_length = 3
    plugin_options = {
        'minLength': 3
    }

    def get_query(self, q, request):
        return LedgerAccount.objects.filter(
            Q(number__icontains=q) |
            Q(name__icontains=q)
        )
