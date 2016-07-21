from ajax_select import LookupChannel
from django.db.models import Q
from letter_of_credit.models import FormMCover, FormM, LCRegister, ConsolidatedLcBidRequest


class FormMCoverLookup(LookupChannel):
    model = FormMCover

    def get_query(self, q, request):
        pass


class FormMLookup(LookupChannel):
    model = FormM
    min_length = 8
    plugin_options = {'minLength': 8}

    def get_query(self, q, request):
        return FormM.objects.filter(Q(number__icontains=q))


class LCRegisterLookup(LookupChannel):
    model = LCRegister
    min_length = 9
    plugin_options = {'minLength': 9}

    def get_query(self, q, request):
        return LCRegister.objects.filter(Q(lc_number__icontains=q))


class ConsolidatedLcBidRequestLookup(LookupChannel):
    model = ConsolidatedLcBidRequest

    def get_query(self, q, request):
        return ConsolidatedLcBidRequest.objects.filter(
                Q(mf__number__icontains=q) |
                Q(mf__applicant__name__icontains=q) |
                Q(mf__lc__lc_number__contains=q)
        )
