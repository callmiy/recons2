from datetime import datetime, date

from django.http import HttpResponse
from django.views.generic import View
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment
from openpyxl.writer.excel import save_virtual_workbook

from letter_of_credit.models import TreasuryAllocation


class DownloadAllocationsView(View):
    def set_header_row(self, sheet):
        font = Font(bold=True, name='Rockwell')
        alignment = Alignment(wrap_text=True, horizontal='center', vertical='center')

        header_col_1 = sheet.cell(row=1, column=1, value='S/N')
        header_col_1.font = font
        header_col_1.alignment = alignment

        header_col_1 = sheet.cell(row=1, column=2, value='DEAL NO.')
        header_col_1.font = font
        header_col_1.alignment = alignment

        s = sheet.cell(row=1, column=3, value='SOURCE')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=4, value='DEAL DATE')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=5, value='REF')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=6, value='NAME')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=7, value='CCY')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=8, value='AMOUNT')
        s.font = font
        s.alignment = alignment

        s = sheet.cell(row=1, column=9, value='RATE')
        s.font = font
        s.alignment = alignment

    def get(self, request):
        wb = Workbook()
        file_name = '%s.xlsx' % datetime.now().strftime('fx-deals-%Y-%m-%d-%H-%S-%f')
        allocation_ids = request.GET.getlist('bid_ids')

        if allocation_ids:
            qs = TreasuryAllocation.objects.filter(pk__in=allocation_ids)
        else:
            qs = TreasuryAllocation.objects.all()

        sheet = wb.active
        self.set_header_row(sheet)
        row = 2
        row_index = 1

        for allocation in qs:
            mf = allocation.mf
            applicant = mf.applicant
            sheet.cell(
                    row=row, column=1, value='' and date.today().strftime('%d-%b-%Y') or row_index)
            sheet.cell(row=row, column=2, value=mf.number)

            lc_number = 'NEW LC'
            lc = mf.lc

            if lc:
                lc_number = lc.lc_number

            sheet.cell(row=row, column=3, value=lc_number)
            sheet.cell(row=row, column=4, value=applicant.name)
            sheet.cell(row=row, column=5, value=mf.currency.code)

            total_allocation = sum([allocation['amount_allocated'] for allocation in allocation.allocations()])
            outstanding_bid_amount = allocation.amount - total_allocation
            sheet.cell(row=row, column=6, value=mf.amount)
            sheet.cell(row=row, column=7, value=outstanding_bid_amount)
            sheet.cell(row=row, column=8, value=total_allocation)
            sheet.cell(row=row, column=9, value=outstanding_bid_amount)

            acct = ''
            acct_numbers_qs = applicant.acct_numbers

            if acct_numbers_qs:
                acct = acct_numbers_qs[0].nuban

            sheet.cell(row=row, column=10, value=acct)
            sheet.cell(row=row, column=11, value=mf.goods_description)
            sheet.cell(row=row, column=12, value='CASH BACKED')

            row += 1
            row_index += 1

        resp = HttpResponse(save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
        resp['Content-Disposition'] = 'attachment; filename="%s"' % file_name
        return resp
