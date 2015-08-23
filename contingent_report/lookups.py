from ajax_select import LookupChannel
from .models import TIPostingStatusReport


class TIPostingStatusReportCustomerDebitLookup(LookupChannel):
    model = TIPostingStatusReport

    def get_query(self, q, request):
        return TIPostingStatusReport.objects.filter(ccy__exact='NGN', amount__lt=0, ref__icontains=q)
