from django.http import HttpResponse
from django.views.generic import View
from letter_of_credit.models import LcBidRequest
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from datetime import datetime


class DownloadBidsView(View):
    def get(self, request):
        file_name = '%s.xlsx' % datetime.now().strftime('%Y-%m-%d-%H-%S-%f')
        wb = Workbook()
        sheet = wb.active
        row = 1
        row_index = 1

        bid_ids = request.GET.getlist('bid_ids')

        if bid_ids:
            for bid in LcBidRequest.objects.filter(pk__in=bid_ids):
                mf = bid.mf
                applicant = mf.applicant

                sheet.cell(row=row, column=1, value=row_index)
                sheet.cell(row=row, column=2, value=applicant.name)
                sheet.cell(row=row, column=3, value=mf.currency.code)
                sheet.cell(row=row, column=4, value=bid.amount)
                sheet.cell(row=row, column=5, value=mf.goods_description)

                acct = ''
                acct_numbers_qs = applicant.acct_numbers

                if acct_numbers_qs:
                    acct = acct_numbers_qs[0].nuban
                sheet.cell(row=row, column=6, value=acct)

                sheet.cell(row=row, column=7, value=mf.number)
                sheet.cell(row=row, column=8, value='NEW LC')
                sheet.cell(row=row, column=9, value='CASH BACKED')

                row += 1
                row_index += 1

                if not bid.downloaded:
                    bid.downloaded = True
                    bid.save()

        resp = HttpResponse(save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
        resp['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        return resp
