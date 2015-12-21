import json
from django.views.generic import View
from django.shortcuts import render, redirect
from cStringIO import StringIO
from contingent_report.csv_utilities import col, UploadCSVParserUtility, LC_REF_RE
import csv
import re
from contingent_report.models import (
    ContingentReport,
    TIPostingStatusReport,
    TIFlexRecons,
    ContingentAccount
)
from letter_of_credit.models import LCRegister
from adhocmodels.models import Currency

admin_url = lambda cls: '/admin/%s/' % str(getattr(cls, '_meta')).replace(
        '.', '/')


class LCRegisterUploadView1(View):
    def get(self, request):
        return render(request, 'upload-lc-register.html')

    def post(self, request):
        uploaded_text = request.POST['upload-lc-register-text']

        if uploaded_text:
            uploaded_text = uploaded_text.strip(' \n\r')

            if uploaded_text:
                self.parse(StringIO(uploaded_text.encode('utf-8', 'ignore')), request.POST)

        return redirect(admin_url(LCRegister))

    def __get_mf_ba(self, text):
        if text.startswith('MF201'):
            return text[:13], text[13:]
        return '', ''

    def parse(self, fobj, post):
        lc_col = getattr(col, post['lc_no'])
        amount_col = getattr(col, post['amount'])

        parser_utility = UploadCSVParserUtility()

        for row in csv.reader(fobj, delimiter='\t'):
            if not lc_col or not amount_col:
                continue
            if self.ok_to_parse(row, lc_col, amount_col):
                mf_raw = parser_utility.normalize_ref(row[getattr(col, post['mf'])])
                mf, ba = self.__get_mf_ba(mf_raw)

                estb_date_ = row[getattr(col, post['estb_date'])]
                estb_date = parser_utility.normalize_date(estb_date_)

                lc_number = parser_utility.normalize_ref(row[lc_col])

                appl_ = row[getattr(col, post['appl'])]
                applicant = parser_utility.normalize(appl_)

                bene_ = row[getattr(col, post['bene'])]
                bene = parser_utility.normalize(bene_)

                post_ccy_ = row[getattr(col, post['ccy'])]
                ccy = parser_utility.normalize(post_ccy_)

                lc_amt_org_ccy = parser_utility.normalize_amount(row[amount_col])

                post_exp_date_ = row[getattr(col, post['exp_date'])]
                expiry_date = parser_utility.normalize_date(post_exp_date_)

                adv_bank_ = row[getattr(col, post['adv_bank'])]
                adv_bank = parser_utility.normalize(adv_bank_)

                brn = ''
                brn_col = getattr(col, post['brn'])
                if len(row) > brn_col:
                    post_brn_ = row[brn_col]
                    brn = parser_utility.normalize(post_brn_)

                lc_obj = LCRegister.objects.filter(lc_number=lc_number)
                if not lc_obj.exists():
                    LCRegister.objects.create(
                            mf=mf,
                            ba=ba,
                            estb_date=estb_date,
                            lc_number=lc_number,
                            applicant=applicant,
                            bene=bene,
                            ccy=ccy,
                            advising_bank=adv_bank,
                            ccy_obj=Currency.objects.get(code=ccy),
                            lc_amt_org_ccy=lc_amt_org_ccy,
                            expiry_date=expiry_date, )
                else:
                    lc = lc_obj[0]
                    if lc.expiry_date != expiry_date:
                        lc.expiry_date = expiry_date
                    if lc.lc_amt_org_ccy != lc_amt_org_ccy:
                        lc.lc_amt_org_ccy = lc_amt_org_ccy
                    if not lc.ba and ba:
                        lc.ba = ba
                    if not lc.mf and mf:
                        lc.mf = mf
                    if not lc.advising_bank and adv_bank:
                        lc.advising_bank = adv_bank
                    if not lc.brn_code and brn:
                        lc.brn_code = brn
                    lc.save()

    def ok_to_parse(self, row, lc_col, amount_col):
        return len(row) > 5 and str(row[lc_col]).startswith('ILCL') and \
               row[amount_col].replace(',', '').replace('.', '').isdigit()


class LCRegisterUploadView(View):
    REPORT_MODEL_HEADERS_MAPPING = {
        "LC ESTABLISHMENT DATE": "estb_date",
        "NAME OF IMPORTER": "applicant",
        "BENEFICIARY": "bene",
        "CNTRY OF PAYMT": "bene_country",
        "LC CURR": "ccy_obj",
        "LC AMOUNT": "lc_amt_org_ccy",
        "LC NUMBER": "lc_number",
        "EXPIRY DATE": "expiry_date",
        'ADVISING BANK': 'advising_bank',
        'APPLICANT REF': 'mf'
    }

    def get(self, request):
        return render(
                request,
                'contingent_report/upload-lc-register.html',
                {'mappings': json.dumps(self.REPORT_MODEL_HEADERS_MAPPING)})

    def post(self, request):
        uploaded_text = request.POST['upload-lc-register-text'].strip(' \n\r')

        if uploaded_text:
            parser_utility = UploadCSVParserUtility()

            amounts_in_cents = request.POST.get('amount-cents', False)

            for data in json.loads(uploaded_text):
                lc = LCRegister.objects.filter(lc_number=data['lc_number'])

                if not lc.exists():
                    data["expiry_date"] = parser_utility.normalize_date(data["expiry_date"])
                    data["estb_date"] = parser_utility.normalize_date(data["estb_date"])
                    data['ccy_obj'] = Currency.objects.get(code=data['ccy_obj'])
                    data["lc_amt_org_ccy"] = float(data["lc_amt_org_ccy"].replace(',', ''))

                    if amounts_in_cents:
                        data["lc_amt_org_ccy"] /= 100

                    LCRegister.objects.create(**data)

        return redirect(admin_url(LCRegister))


class LCRegisterUpdateView(View):
    MAPPINGS = {
        'Lc Reference No': "lc_number",
        'Maturity Date': "expiry_date",
        'Correspondent Bank': 'advising_bank',
        'Customer Id': 'applicant_id',
        'Originating Branch': 'brn_code',
        'Branch Name': 'brn_name',
        'Customer Acct No': 'acct_numb'
    }

    def get(self, request):
        return render(
                request,
                'contingent_report/update-lc-register.html',
                {'mappings': json.dumps(self.MAPPINGS)}
        )

    def post(self, request):
        uploaded_text = request.POST['update-lc-register-text'].strip(' \n\r')

        if uploaded_text:
            parser_utility = UploadCSVParserUtility()

            for data in json.loads(uploaded_text):
                lc_obj = LCRegister.objects.filter(lc_number=data['lc_number'])
                if lc_obj.exists():
                    lc_obj = lc_obj[0]
                    del data["lc_number"]
                    data["expiry_date"] = parser_utility.normalize_date(data["expiry_date"])

                    for key in data:
                        if hasattr(lc_obj, key) and data[key]:
                            setattr(lc_obj, key, data[key])
                    lc_obj.save()

        return redirect(admin_url(LCRegister))


class TIPostingStatusUploadView(View):
    def get(self, request):
        return render(request, 'upload-ti-posting-status-report.html')

    def post(self, request):
        uploaded_text = request.POST['upload-ti-posting-status-text']

        if uploaded_text:
            uploaded_text = uploaded_text.strip(' \n\r')

            if uploaded_text:
                self.parse(StringIO(uploaded_text.encode('utf-8', 'ignore')))

        return redirect(admin_url(TIPostingStatusReport))

    def parse(self, fobj):
        parser_utility = UploadCSVParserUtility()
        for row in csv.reader(fobj, delimiter='\t'):
            if self.ok_to_parse(row):
                ref = parser_utility.normalize_ref(row[col.b])
                posting_date = parser_utility.normalize_date(row[col.c])
                acct_number = parser_utility.normalize_acct_numb(row[col.d])
                ccy = parser_utility.normalize(row[col.f])
                amount_raw = parser_utility.normalize_amount(row[col.j])
                amount = -amount_raw if row[col.h] == 'D' else amount_raw
                narration = parser_utility.normalize(row[col.g])
                success = parser_utility.normalize(row[col.j])

                post_obj = TIPostingStatusReport.objects.filter(
                        ref=ref, posting_date=posting_date, amount=amount, ccy=ccy,
                        narration=narration)

                if not post_obj.exists():
                    TIPostingStatusReport.objects.create(
                            ref=ref, posting_date=posting_date, amount=amount,
                            acct_number=acct_number, ccy=ccy, success=success,
                            narration=narration)
                else:
                    post = post_obj[0]
                    if post.success != success and post.acct_number:
                        post.success = success
                        post.save()

    def ok_to_parse(self, row):
        row = [x.upper() for x in row if x.strip(' ')]
        if 'TI POSTING STATUS REPORT' in row or 'REFERENCE' in row or \
                        len(row) < 8:
            return False
        return True


class UploadContingentReportView(View):
    """From BO contingent report file."""

    def get(self, request, acct_status=None):
        return render(
                request,
                'upload-contingent.html')

    def post(self, request, acct_status=None):
        uploaded_text = request.POST['upload-contingent-text']

        if uploaded_text:
            uploaded_text = uploaded_text.strip(' \n\r')

            if uploaded_text:
                self.parse(StringIO(uploaded_text.encode('utf-8', 'ignore')))

        return redirect(admin_url(ContingentReport))

    def ok_to_parse(self, row):
        if 'CONTINGENT REPORT' in row or len([x for x in row if x]) < 5 or \
                        'Trn Ref No' in row:
            return False
        return True

    def parse(self, fobj):
        parser_utility = UploadCSVParserUtility()
        for row in csv.reader(fobj, delimiter='\t'):
            if self.ok_to_parse(row):
                booking_date = parser_utility.normalize_date(row[col.g])
                liq_date = parser_utility.normalize_date(row[col.h])
                fx_amt = parser_utility.normalize_amount(row[col.j])
                ngn_amt = parser_utility.normalize_amount(row[col.k])
                narration = parser_utility.normalize(row[col.l])
                flex_module = row[col.d]
                gl_code = row[col.b]
                ccy = row[col.i]

                ti_ref_pattern = LC_REF_RE.search(narration)
                ti_ref = ti_ref_pattern and ti_ref_pattern.group() or ''

                flex_ref = row[col.a]

                if not ContingentReport.objects.filter(
                        flex_ref=flex_ref,
                        gl_code=gl_code,
                        ccy=ccy,
                        booking_date=booking_date,
                        flex_module=flex_module,
                        fx_amt=fx_amt,
                        narration=narration
                ).exists():
                    ContingentReport.objects.create(
                            flex_ref=flex_ref,
                            flex_module=flex_module,
                            gl_code=gl_code,
                            booking_date=booking_date,
                            liq_date=liq_date,
                            ccy=ccy,
                            fx_amt=fx_amt,
                            ngn_amt=ngn_amt,
                            ti_ref=ti_ref,
                            narration=narration,
                            acct_numb=ContingentAccount.objects.get(gl_code=gl_code)
                    )


class TIFlexDatePromptView(View):
    """From BO TIPLUS-FLEXCUBE RECONS REP-DATE PROMPT file."""

    def get(self, request):
        return render(
                request,
                'upload-ti-flex-date-prompt.html')

    def post(self, request):
        uploaded_text = request.POST['ti-flex-date-prompt-text']

        if uploaded_text:
            uploaded_text = uploaded_text.strip(' \n\r')

            if uploaded_text:
                self.parse(StringIO(uploaded_text.encode('utf-8', 'ignore')))

        return redirect('/admin/contingent_report/tiflexrecons/')

    def ok_to_parse(self, row):
        if 'Acct Branch Name' in row or len([x for x in row if x]) < 5 or \
                        'TIPLUS-FLXECUBE RECON REP-DATE PROMPT' in row:
            return False
        return True

    def parse(self, fobj):
        parser_utility = UploadCSVParserUtility()
        pattern = re.compile(r'^([A-Z0-9]{7,})(?:[A-Z]{3}\d{3})?$')

        for row in csv.reader(fobj, delimiter='\t'):
            if self.ok_to_parse(row):
                dr_cr = row[col.m]
                fcy_amt = parser_utility.normalize_amount(row[col.k])
                lcy_amt = parser_utility.normalize_amount(row[col.l])

                TIFlexRecons.objects.get_or_create(
                        brn_code=row[col.a],
                        brn_name=row[col.b],
                        flex_ref=row[col.e],
                        ti_ref=re.sub(pattern, r'\1', row[col.f].strip(' \n\r\t')),
                        acct_numb=row[col.g],
                        acct_name=row[col.i],
                        ccy=row[col.j],
                        dr_cr=dr_cr,
                        fcy_amt=-fcy_amt if dr_cr == 'D' else fcy_amt,
                        lcy_amt=-lcy_amt if dr_cr == 'D' else lcy_amt,
                        val_date=parser_utility.normalize_date(row[col.n], '-'),
                        narration=row[col.p])
