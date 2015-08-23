from django.http.response import HttpResponse
from django.shortcuts import render
from django.views.generic import View
from datetime import date
from xlwt.Workbook import Workbook
from .models import Charge
import logging
import logging.config

logger = logging.getLogger('recons_logger')


class PrintChgsView(View):
    def get(self, request, reqtype):
        _ids = request.GET["ids"]
        self.chgs = Charge.objects.filter(pk__in=_ids.split(",")).order_by(
            'customer__id', 'lc_number', 'req_bank__swift_bic')

        msg = 'user: %s\n' % request.user
        msg += 'charges selected for print "%s"\n' % reqtype
        msg += 'S/N|Name|LC Number|Ccy|Amount|Bank\n'
        for index, chg in enumerate(self.chgs):
            msg += '%d|%s|%s|%s|%s|%s\n' % (
                index + 1, chg.customer.name, chg.lc_number, chg.ccy.code,
                chg.amount, chg.req_bank.swift_bic,)

        logger.info(msg)

        # reqtype is one of move_instr, or dealers.
        # it determines what template to load.
        return render(
            request, '%s-chgs-request.html' % reqtype,
            {'chgs': self.chgs,
             'date': date.today().strftime("%d-%b-%Y"),
             'ids': _ids})


class UpdateDateView(View):
    def get(self, request):
        return render(
            request, 'chgs/update-dates.html',
        )


class DownloadChgs(View):
    def get(self, request):
        wb = Workbook()
        wsh = wb.add_sheet('Charges')

        write_row = lambda row, *vals: [wsh.write(row, col, val) for col, val in enumerate(vals)]
        row = 0
        headers = (
            # <editor-fold desc="">
            'S/N',
            'LC Number',
            'Customer Name',
            'Ccy',
            'Amount',
            'Bank',
            'Account',
            'Date charge notified',
            'Ticket Request Date',
            'Ticket Moved Date',
            # </editor-fold>
        )

        write_row(row, *headers)
        row += 1
        seq = 1
        for chg in Charge.objects.all():
            write_row(
                row,
                seq,
                chg.lc_number,
                chg.customer.name,
                chg.currency(),
                chg.amount,
                chg.display_req_bank(),
                chg.get_cr_acct(),
                chg.chg_notification_date(),
                chg.tkt_req_date,
                chg.tkt_mvd_date,
            )
            row += 1
            seq += 1

        resp = HttpResponse(content_type='application/xls')
        resp['Content-Disposition'] = 'attachment;filename="all-chgs.xls"'
        wb.save(resp)
        return resp
