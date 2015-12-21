from django.views.generic import View
from django.http import HttpResponse
from contingent_report.models import (
    ContingentReport,
    TIPostingStatusReport,
    LCClass,
    ContingentAccount
)
from letter_of_credit.models import LCRegister
from django.shortcuts import render
from contingent_report.csv_utilities import parse_date, wrow
from xlwt import Workbook

__all__ = (
    'ContingentBalancesViewRiskMgmt',
    'ContingentNonPostView',
    'OutStandingLCBalances',
    'OldContingentBalancesViewRiskMgmt',
)


class ContingentBalancesView(View):
    info = ''
    title = ''
    submit_btn_val = ''
    download_file_name = ''

    def get(self, request):
        return render(
            request,
            'from-to-date.html',
            {'header': self.info, 'title': self.title,
             'submit_btn_val': self.submit_btn_val,
             'show_end_date': True}
        )

    def post(self, request):
        self.end_date = parse_date(request.POST['endt'])
        self.response = HttpResponse(content_type='application/xls')
        self.response['Content-Disposition'] = \
            'attachment; filename="%s-%s"' % (self.end_date, self.download_file_name,)

        self.contingent_accounts_asset = ContingentAccount.objects.filter(in_use=True, acct_class='ASSET')

        self.contingent_accounts_asset_gl_codes = self.contingent_accounts_asset.values_list('gl_code', flat=True)

        conts = ContingentReport.objects.filter(
            gl_code__in=self.contingent_accounts_asset_gl_codes,
            booking_date__lte=self.end_date).exclude(ti_ref__isnull=True)

        self.lc_references = set(conts.values_list('ti_ref', flat=True))
        self.ccys = set(conts.values_list('ccy', flat=True))
        self.wb = Workbook()


class OutStandingLCBalances(ContingentBalancesView):
    info = 'OUTSTANDING LC BALANCES'
    title = 'Outstanding LC Balances'
    submit_btn_val = 'Get Outstanding LC Balances'
    download_file_name = 'Outstanding-LC-Balances.xls'

    def post(self, request):
        super(OutStandingLCBalances, self).post(request)
        seq, row = 1, 0
        sheet = self.wb.add_sheet('Outstanding LC Balances')

        wrow(sheet, row,
             ('S/NO', 'CUSTOMER NAME', 'LC REFERENCE NO', 'CCY', 'LC AMOUNT',
              'OUTSTANDING', 'ESTB DATE', 'EXPIRE DATE',))
        row += 1

        not_found = []
        for lc in self.lc_references:
            contingents = ContingentReport.objects.filter(
                ti_ref=lc, booking_date__lte=self.end_date, acct_class='ASSET')

            sum_amount = sum([con.fx_amt for con in contingents])

            if sum_amount != 0:
                try:
                    cont_obj = contingents[0]
                    cont_ccy = cont_obj.ccy
                    lc_obj = LCRegister.objects.get(lc_number=lc)

                    vals = (
                        seq, lc_obj.applicant, lc, cont_ccy,
                        lc_obj.lc_amt_org_ccy, sum_amount,
                        lc_obj.estb_date, lc_obj.expiry_date,)

                    wrow(sheet, row, vals)
                    row += 1
                    seq += 1
                except LCRegister.DoesNotExist:
                    not_found.append(lc)

        if not_found:
            print '\n\n\nnot_found = ', not_found, '\n' * 3
            sheet1 = self.wb.add_sheet("Not found in Register")
            rowx = 0
            [wrow(sheet1, rowx + t, [t + 1, l]) for t, l in enumerate(not_found)]

        self.wb.save(self.response)
        return self.response


class ContingentBalancesViewRiskMgmt(ContingentBalancesView):
    info = 'Contingent Balances Report - Risk Management'
    title = 'Contingent Balance Risk Mgmt-'
    submit_btn_val = 'Get Contingent Balances'
    download_file_name = 'cont-bal-risk-mgmt.xls'

    def post(self, request):
        super(ContingentBalancesViewRiskMgmt, self).post(request)

        wb = Workbook()
        rates, ngn_bals, sum_lc_bal, sum_ngn_bals = {}, {}, {}, {}
        sheets = {'ALL': wb.add_sheet('CONTINGENTS')}
        rows = {'ALL': 0}
        seqs = {'ALL': 1}

        wrow(
            sheets['ALL'],
            rows['ALL'],
            ('S/NO',
             'CUSTOMER NAME',
             'LC REFERENCE NO',
             'CUSTOMER ID',
             'CUSTOMER ACCT NO',
             'LC TYPE',
             'CORRESPONDENT BANK',
             'BENEFICIARY',
             'TRANSACTION CURRENCY',
             'EXCHANGE RATE',
             'GLOBAL LIMIT APPROVED (TCY)',
             'LC AMOUNT FINANCED (TCY)',
             'OUTSTANDING (TCY)',
             'OUTSTANDING (LCY)',
             'EFFECTIVE DATE',
             'MATURITY DATE',
             'ORIGINATING BRANCH',
             'MARGIN DEPOSIT')
        )
        rows['ALL'] += 1

        for cur in self.ccys:
            for cont_acct in self.contingent_accounts_asset.filter(ccy=cur):
                gl_code = cont_acct.gl_code

                if cur not in ngn_bals:
                    ngn_bals[cur] = {gl_code: cont_acct.get_ngn_bal(self.end_date)}
                    sum_lc_bal[cur] = {gl_code: 0}
                    sum_ngn_bals[cur] = {gl_code: 0}
                else:
                    ngn_bals[cur][gl_code] = cont_acct.get_ngn_bal(self.end_date)
                    sum_lc_bal[cur][gl_code] = 0
                    sum_ngn_bals[cur][gl_code] = 0

            rates[cur] = ContingentAccount.get_rate_for_accounts_in_ccy(cur, self.end_date)
            sheets[cur] = wb.add_sheet(cur)

            rows[cur] = 0
            seqs[cur] = 1

            wrow(
                sheets[cur],
                rows[cur],
                (
                    'S/N', 'LC NUMBER', 'CCY', 'RATE', 'FX BALANCE', 'NGN BALANCE', 'ESTB. DATE', 'EXP. DATE',
                )
            )

            rows[cur] += 1

        for lc in self.lc_references:
            contingents = ContingentReport.objects.filter(
                ti_ref=lc, booking_date__lte=self.end_date, gl_code__in=self.contingent_accounts_asset_gl_codes)

            sum_amount = sum([con.fx_amt for con in contingents])

            # print '\n\n\n\nsum_amount = ', sum_amount, '\n\n\n\n\n'

            if sum_amount != 0:
                cont_obj = contingents[0]
                gl_code = cont_obj.gl_code
                cont_ccy = cont_obj.ccy

                sum_lc_bal[cont_ccy][gl_code] += -sum_amount
                naira_amt = -float(sum_amount) * rates[cont_ccy]
                sum_ngn_bals[cont_ccy][gl_code] += naira_amt

                try:
                    lc_obj = LCRegister.objects.filter(lc_number=lc)[0]

                    vals_all = (
                        seqs['ALL'],
                        lc_obj.applicant,
                        lc,
                        '',
                        lc_obj.acct_numb,
                        lc_obj.lc_class,
                        lc_obj.advising_bank,
                        lc_obj.bene,
                        cont_ccy,
                        rates[cont_ccy],
                        '',
                        lc_obj.lc_amt_org_ccy,
                        -sum_amount, naira_amt,
                        lc_obj.estb_date,
                        lc_obj.expiry_date,
                        lc_obj.brn_name,
                        self.get_margin_status(lc)
                    )

                    wrow(sheets['ALL'], rows['ALL'], vals_all)
                    seqs['ALL'] += 1
                    rows['ALL'] += 1

                    vals = (
                        seqs[lc_obj.ccy],
                        lc,
                        lc_obj.ccy,
                        rates[cont_ccy],
                        sum_amount,
                        naira_amt,
                        lc_obj.estb_date,
                        lc_obj.expiry_date,
                    )

                    wrow(sheets[lc_obj.ccy], rows[lc_obj.ccy], vals)
                    seqs[lc_obj.ccy] += 1
                    rows[lc_obj.ccy] += 1

                except:
                    naira_amt = float(sum_amount) * rates[cont_ccy]

                    vals_all_nolc = (
                        seqs['ALL'], lc, '', '', '', 'ILC', '', naira_amt,
                        cont_ccy, sum_amount, '', 'liq_date')
                    wrow(sheets['ALL'], rows['ALL'], vals_all_nolc)
                    seqs['ALL'] += 1
                    rows['ALL'] += 1

                    # vals.insert(0, seqs['ALL'])
                    # vals.append(cont_ccy)
                    # vals.append(sum_amount)

        for ccy1 in self.ccys:
            for acct in self.contingent_accounts_asset.filter(ccy=ccy1):
                cont_bal = acct.get_fx_balance(self.end_date)

                wrow(
                    sheets[ccy1],
                    rows[ccy1],
                    ('', '', '', 'bal direct from contingent account', cont_bal, sum(ngn_bals[ccy1].values()))
                )

                rows[ccy1] += 1

                wrow(
                    sheets[ccy1],
                    rows[ccy1],
                    (
                        '',
                        '',
                        '',
                        'Bal obtained by summing individual lc bal.',
                        sum(sum_lc_bal[ccy1].values()),
                        sum(sum_ngn_bals[ccy1].values())
                    )
                )
                rows[ccy1] += 1

        rows['ALL'] = self.write_lc_ref_key(sheets['ALL'], rows['ALL'])

        rows['ALL'] = self.write_cont_acct_balances(sheets['ALL'], rows['ALL'], sum_lc_bal)

        rows['ALL'] += 4
        wrow(sheets['ALL'], rows['ALL'], ('', 'NAIRA BALANCES',))
        rows['ALL'] += 1

        for ccy1 in self.ccys:
            for acct in self.contingent_accounts_asset.filter(ccy=ccy1):
                wrow(sheets['ALL'], rows['ALL'], ('', ccy1, acct.gl_code, acct.get_ngn_bal(self.end_date),))
                rows['ALL'] += 1

        wb.save(self.response)
        return self.response

    def write_lc_ref_key(self, sheet, row):
        """LC REFERENCE KEY."""
        row += 1
        wrow(sheet, row, ('', 'LC REFERENCE KEY'))
        row += 1
        for pcode, pdesc in LCClass.objects.values_list('prod_code', 'desc'):
            wrow(sheet, row, ('', pcode, pdesc,))
            row += 1
        return row

    def write_cont_acct_balances(self, sheet, row, sum_lc_bal):
        """CONTINGENT ACCOUNT BALANCES."""
        row += 1
        wrow(sheet, row, ('', 'CONTINGENT ACCOUNT BALANCES'))
        row += 1
        wrow(
            sheet,
            row,
            (
                'S/N',
                'ACCT NO.',
                'CCY',
                'FX BALANCE',
                'BALANCES SUMMING INDIVIDUAL LC',
                'CA-LC-BALCD',
                'CONT BALCD WITH LC BALANCES'
            )
        )
        row += 1
        cont_acct_seq = 1

        for cont_acct in ContingentAccount.objects.all():
            fx_bal = cont_acct.get_fx_balance(self.end_date)
            gl_code = cont_acct.gl_code

            bal = sum_lc_bal.get(cont_acct.ccy)

            if not bal:
                lc_balances = 0
            else:
                if cont_acct.acct_class == 'ASSET':
                    lc_balances = bal.get(gl_code, 0)
                else:
                    lc_balances = bal.get(cont_acct.get_acctount_counterpart(), 0)

            wrow(
                sheet,
                row,
                (
                    cont_acct_seq,
                    gl_code,
                    cont_acct.ccy,
                    fx_bal,
                    lc_balances,
                    str(cont_acct.is_ca_cl_balcd(self.end_date)),
                    str(abs(fx_bal) == abs(float(lc_balances)))
                )
            )
            row += 1
            cont_acct_seq += 1

        return row

    def get_margin_status(self, lc):
        """Determing margin status from 1st 7 chars of lc number."""
        prod_code = lc[:7]
        if prod_code in ('ILCLCSH', 'ILCLCDO'):
            return r'100% BY CUSTOMER'
        elif prod_code in ('ILCLITF', 'ILCLUNC'):
            return 'NONE'

        return 'INFORMATION WITH TROPS'


class OldContingentBalancesViewRiskMgmt(ContingentBalancesView):
    info = 'Old Contingent Balances Report - Risk Management'
    title = 'Old Contingent Balance Risk Mgmt-'
    submit_btn_val = 'Get Old Contingent Balances'
    download_file_name = 'old-cont-bal-risk-mgmt.xls'

    def post(self, request):
        super(OldContingentBalancesViewRiskMgmt, self).post(request)


class ContingentNonPostView(View):
    def get(self, request):
        return render(
            request,
            'from-to-date.html',
            {'header': 'Items Not Posted By TI: Contingent',
             'title': 'Non Post: Contingent Report-',
             'show_start_date': True,
             'show_end_date': True})

    def post(self, request):
        start_date = parse_date(request.POST['stdt'])
        end_date = parse_date(request.POST['endt'])

        if start_date > end_date:
            raise Exception('Start date must be less than end date')

        queryset = TIPostingStatusReport.objects.filter(
            posting_date__gte=start_date,
            posting_date__lte=end_date).exclude(ccy='NGN').exclude(
            ref__startswith='CBN')

        if queryset.exists():
            wb = Workbook()
            sh = wb.add_sheet('Ti Contingent Non Post')
            row = 0
            seq = 1
            wrow(
                sh, row, (
                    'SEQ', 'LC NUMBER', 'POSTING DATE', 'ACCOUNT NUMBER', 'CCY',
                    'AMOUNT', 'APPLICANT', 'POST STATUS',))
            row += 1

            for post in queryset:
                if not (post.is_customer_acct() or post.is_vat_acct() or
                            post.is_income_acct() or post.post_success()):
                    wrow(sh, row,
                         (seq, post.ref, post.posting_date, post.acct_number,
                          post.ccy, post.amount, post.applicant,
                          str(post.post_success())))
                    row += 1
                    seq += 1

            response = HttpResponse()
            response['Content-type'] = 'application/xls'
            response['Content-Disposition'] = \
                'attachment; filename="contingent-nonpost.xls"'
            wb.save(response)
            return response
