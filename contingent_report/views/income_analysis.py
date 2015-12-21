from django import forms
from django.db.models import Q
from django.views.generic import View
from django.shortcuts import render
from django.http import HttpResponse
from contingent_report.models import TIPostingStatusReport
from contingent_report.csv_utilities import wrow as writerow, UploadCSVParserUtility
import csv
from cStringIO import StringIO
from xlwt import Workbook
import re
from string import lowercase
from collections import namedtuple

Col = namedtuple('Col', ' '.join(c for c in lowercase))
col = Col(*range(len(lowercase)))

__all__ = ('UploadIncomeView',)

EMPTY_ACCOUNT = ''

PATTERNS_RE = (
    (re.compile(r"ILCL[A-Z]{3}\d{9}"), 0),
    (re.compile(r"MF[\dA-Z]{7,}"), 0),
    (re.compile(r"FOBC\d{8}"), 0),
    (re.compile(r"FCO|OT[EG]\d{9}"), 0),
    (re.compile(r"(CF[EGC]\d{9})"), 0),
    (re.compile(r"AA\d+"), 0)
)
ACCOUNT_RE = re.compile(r"\s+(\d{10})[^0-9]*", re.IGNORECASE)


class IncomeUploadForm(forms.Form):
    upload_income = forms.CharField(
        label='Upload Income', widget=forms.Textarea)
    narr = forms.CharField(
        label='Narration Column Letter')


class UploadIncomeView(View):
    """Upload Income Data and get account number.

    In this view, income data provided by Lolade Oginni of finance services
    will be uploaded and an output excel is generated with the acount numbers
    from which the incomes were taken.
    """

    def get(self, request):
        return render(
            request, 'income-upload.html', {'form': IncomeUploadForm()})

    def post(self, request):
        form = IncomeUploadForm(request.POST)

        if form.is_valid():
            income_text = form.cleaned_data['upload_income'].encode(
                'utf-8', 'ignore').strip(' \n\r\t')
            _csv = csv.reader(StringIO(income_text), delimiter='\t')

            wb = Workbook()
            self.sh = wb.add_sheet('Trade Finance Related')
            self.wrow = 0
            self.narr_pos = getattr(
                col, form.cleaned_data['narr'].strip().lower())
            self.acct_pos = 4
            header_row = _csv.next()
            header_row.insert(self.acct_pos, 'Customer Acct.')
            self.one_row(header_row)  # write headers.

            self._p = UploadCSVParserUtility()

            for row_list in _csv:
                self.process_row(row_list)

            resp = HttpResponse(content_type='application/xls')
            resp['CONTENT-DISPOSITION'] = \
                'attachment;filename="Income Proof.xls"'
            wb.save(resp)
            return resp

        return render(request, 'income-upload.html', {'form': form})

    def one_row(self, row_list):
        """Write one row into the excel file."""
        writerow(self.sh, self.wrow, [k for k in row_list])
        self.wrow += 1

    def get_query_param(self, narration):
        for pattern, position in PATTERNS_RE:
            matched = pattern.search(narration)
            if matched:
                return matched.group(position)

    def process_row(self, row_list):
        """
        :param list row_list:
        :return None:
        """
        acct = ''
        filter_param = self.get_query_param(row_list[self.narr_pos])
        if filter_param:
            acct = self.get_income_acct(filter_param)
        row_list.insert(self.acct_pos, acct)
        self.one_row(row_list)

    def get_income_acct(self, filter_param):
        posts = TIPostingStatusReport.objects.filter(
            Q(ref=filter_param) | Q(narration__contains=filter_param))
        for post in posts:
            acct = post.is_customer_acct()
            if acct:
                return acct

        return EMPTY_ACCOUNT


class Income2View(View):
    def get(self, request):
        filter_param = request.GET.get('filter_param')
        if filter_param:
            posts = TIPostingStatusReport.objects.filter(
                Q(ref=filter_param) | Q(narration__contains=filter_param))
            for post in posts:
                acct = post.is_customer_acct()
                if acct:
                    return HttpResponse(acct)
            return HttpResponse(None)

        return render(request, 'contingent_report/income2.html')
