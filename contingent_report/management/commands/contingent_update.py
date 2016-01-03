from django.core.management.base import BaseCommand
from django.db.models import Q
from contingent_report.models import ContingentReport, TIPostingStatusReport, LCClass
from letter_of_credit.models import LCRegister


class Command(BaseCommand):
    help = """Update the lc numbers (ti_ref) for contingent model"""

    def handle(self, *args, **kwargs):
        for cont in ContingentReport.objects.filter(
                                Q(ti_ref__isnull=True) | Q(ti_ref='') | Q(customer_name__isnull=True)):
            cont.insert_ti_ref()
            cont.insert_customer_name()
            cont.save()

        lc_classes = LCClass.objects.values_list('prod_code', flat=True)

        for lc in LCRegister.objects.filter(Q(lc_class__isnull=True) | Q(lc_class='')):
            ref_class = lc.lc_number[:7]
            if ref_class in lc_classes:
                lc.lc_class = lc_classes[ref_class]
                lc.save()

        for lc in LCRegister.objects.filter(acct_numb__isnull=True):
            if not lc.update_acct_numb():
                for ti in TIPostingStatusReport.objects.filter(ref=lc.lc_number):
                    acct_numb = ti.is_customer_acct()
                    if acct_numb:
                        lc.acct_numb = acct_numb
                        lc.save()
