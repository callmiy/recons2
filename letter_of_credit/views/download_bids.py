from django.http import HttpResponse
from django.views.generic import View
from letter_of_credit.models import LcBidRequest
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from openpyxl.styles import Font
from datetime import datetime


class DownloadBidsView(View):
    def get(self, request):
        wb = Workbook()
        sheet = wb.active
        bid_ids = request.GET.getlist('bid_ids')
        mark_as_downloaded = False

        if bid_ids:
            file_name = '%s.xlsx' % datetime.now().strftime('fx-request-%Y-%m-%d-%H-%S-%f')
            mark_as_downloaded = True
        else:
            file_name = '%s.xlsx' % datetime.now().strftime('all-bids-%Y-%m-%d-%H-%S-%f')
            bid_ids = LcBidRequest.objects.values_list('pk', flat=True)

        if bid_ids:
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
            sheet.cell(row=1, column=10, value='ESTB. DATE').font = font

            if not mark_as_downloaded:
                # we are downloading all bids
                sheet.cell(row=1, column=11, value='TOTAL ALLOCATION').font = font
                sheet.cell(row=1, column=12, value='UNALLOCATED').font = font
                sheet.cell(row=1, column=13, value='DATE SENT TO TREASURY').font = font
                sheet.cell(row=1, column=14, value='REMARK').font = font

            row = 2
            row_index = 1

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
                lc_number = 'NEW LC'
                estb_date = ''
                lc = mf.lc

                if lc:
                    lc_number = lc.lc_number
                    estb_date = lc.estb_date.strftime('%Y-%m-%d')

                sheet.cell(row=row, column=7, value=mf.number)
                sheet.cell(row=row, column=8, value=lc_number)
                sheet.cell(row=row, column=10, value=estb_date)
                maturity = 'CASH BACKED'

                if bid.maturity:
                    maturity = mark_as_downloaded and bid.maturity.strftime('%d-%b-%Y') or bid.maturity

                sheet.cell(row=row, column=9, value=maturity)
                remark = ''

                if bid.deleted_at:
                    remark = 'bid deleted'
                elif mf.deleted_at:
                    remark = 'form M cancelled'

                sheet.cell(row=row, column=11, value=remark)

                if not mark_as_downloaded:
                    total_allocation = sum([allocation['amount_allocated'] for allocation in bid.allocations()])
                    sheet.cell(row=row, column=11, value=total_allocation)
                    sheet.cell(row=row, column=12, value=(bid.amount - total_allocation))
                    sheet.cell(row=row, column=13, value=bid.requested_at)
                    sheet.cell(row=row, column=14, value=remark)

                row += 1
                row_index += 1

                if mark_as_downloaded and not bid.downloaded:
                    bid.downloaded = True
                    bid.save()

        resp = HttpResponse(save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
        resp['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        return resp
