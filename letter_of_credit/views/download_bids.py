from django.http import HttpResponse
from django.views.generic import View
from letter_of_credit.models import LcBidRequest
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from openpyxl.styles import Font
from datetime import datetime


class DownloadBidsView(View):
    def get(self, request):
        bid_ids = request.GET.getlist('bid_ids')

        if bid_ids:
            file_name = '%s.xlsx' % datetime.now().strftime('fx-request-%Y-%m-%d-%H-%S-%f')
            wb = Workbook()
            sheet = wb.active
            row = 2
            row_index = 1

            font = Font(bold=True)

            sheet.cell(row=1, column=1, value='S/N').font = font
            sheet.cell(row=1, column=2, value='CUSTOMER').font = font
            sheet.cell(row=1, column=3, value='CURR').font = font
            sheet.cell(row=1, column=4, value='AMOUNT').font = font
            sheet.cell(row=1, column=5, value='PURPOSE').font = font
            sheet.cell(row=1, column=6, value='A/C NO.').font = font
            sheet.cell(row=1, column=7, value='MF NO').font = font
            sheet.cell(row=1, column=8, value='LC REF.').font = font
            sheet.cell(row=1, column=9, value='MATURITY DATE').font = font

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
                sheet.cell(row=row, column=8, value=mf.lc_number() or 'NEW LC')
                maturity = 'CASH BACKED'
                if bid.maturity:
                    maturity = bid.maturity.strftime('%d-%b-%Y')
                sheet.cell(row=row, column=9, value=maturity)

                row += 1
                row_index += 1

                if not bid.downloaded:
                    bid.downloaded = True
                    bid.save()

        resp = HttpResponse(save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
        resp['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        return resp
