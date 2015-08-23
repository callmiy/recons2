from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings
from django.shortcuts import render
from .models import IbdInt
from xlwt import Workbook
import os

itf_report_xl_path = os.path.join(settings.MEDIA_ROOT, 'itf-report.xls')


class ITFReportView(View):

    def get(self, request):
        itfs = IbdInt.objects.filter(
            id__in=[int(_id) for _id in request.GET['ids'].split(',')])

        summary = self.write_report_xl(itfs)

        return render(request, 'itf-report.html', {'summary': summary})

    def post(self, request):
        response = HttpResponse()
        response['Content-Type'] = 'application/xls'
        response[
            'Content-Disposition'] = 'attachment;filename="itf-report.xls"'
        response.write(open(itf_report_xl_path, 'rb').read())
        return response

    def write_report_xl(self, itfs):
        headers = ("S/N", "LC NUMBER", "CUSTOMER NAME",
                   "CCY", "AMOUNT", 'RELATIONSHIP MANAGER')

        xl = Workbook()
        self.xlsh = xl.add_sheet("ITF-REPORT")
        row_in_xlsh = 0

        self.write_xl_row(("", "", "ITF INTEREST REPORT",), row_in_xlsh)
        row_in_xlsh += 1

        self.write_xl_row(headers, row_in_xlsh)
        row_in_xlsh += 1

        sequence = 1
        for itf in itfs:
            self.write_xl_row(
                (sequence, itf.lc_number, itf.customer.name, itf.currency(),
                 itf.amount, itf.rm_name(),),
                row_in_xlsh)
            row_in_xlsh += 1
            sequence += 1

        xl.save(open(itf_report_xl_path, 'wb'))

        return '%d Itfs reported for the given period' % len(itfs)

    def write_xl_row(self, row_vals_list, to_row):
        [self.xlsh.write(to_row, col, val)
         for col, val in enumerate(row_vals_list)]
