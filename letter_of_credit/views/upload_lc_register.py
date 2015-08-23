import json
from django.views.generic import View
from django.shortcuts import render, redirect
from adhocmodels.models import Currency
from letter_of_credit.models import LCRegister
from core_recons.csv_utilities import UploadCSVParserUtility
import logging

logger = logging.getLogger('recons_logger')
admin_url = lambda cls: '/admin/%s/' % str(getattr(cls, '_meta')).replace('.', '/')


class ReleaseTelexView(View):
    def get(self, request):
        return render(request, 'letter_of_credit/release-telex.html')


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
            'letter_of_credit/upload-lc-register.html',
            {'mappings': json.dumps(self.REPORT_MODEL_HEADERS_MAPPING)}
        )

    def post(self, request):
        uploaded_text = request.POST['upload-lc-register-text'].strip(' \n\r')

        logger.info("Raw data received from client:\n%s" % uploaded_text)

        if uploaded_text:
            parser_utility = UploadCSVParserUtility()

            amounts_in_cents = request.POST.get('amount-cents', False)

            for data in json.loads(uploaded_text):
                logger.info('About to create or update lc using raw data from client:\n%s' % data)

                data["expiry_date"] = parser_utility.normalize_date(data["expiry_date"])
                data["estb_date"] = parser_utility.normalize_date(data["estb_date"])
                data['ccy_obj'] = Currency.objects.get(code=data['ccy_obj'])
                data["lc_amt_org_ccy"] = float(data["lc_amt_org_ccy"].replace(',', ''))

                if amounts_in_cents:
                    data["lc_amt_org_ccy"] /= 100

                logger.info('About to create or update lc after raw data from client cleaned up:\n%s' % data)

                lc_number = data['lc_number']

                logger.info("Checking if LC %s exists in database" % lc_number)
                lc = LCRegister.objects.filter(lc_number=lc_number)

                if not lc.exists():
                    logger.info("LC %s does not exist in database, it will be created" % lc_number)
                    LCRegister.objects.create(**data)
                    logger.info("LC %s successfully created." % lc_number)
                else:
                    logger.info(
                        "LC %s exists in database, it will be updated if at least one attribute value has changed" % \
                        lc_number
                    )
                    lc = lc[0]

                    attr_val_from_lc_changed = False

                    for key in data:
                        client_attr_val = data[key]
                        lc_attr_val = getattr(lc, key, None)

                        if key == "lc_amt_org_ccy":
                            client_attr_val = float(client_attr_val)

                        if client_attr_val != lc_attr_val:
                            logger.info(
                                'LC %s: attribute "%s" has changed from "%s" to "%s". It will be updated' % (
                                    lc_number, key, lc_attr_val, client_attr_val)
                            )

                            setattr(lc, key, client_attr_val)
                            attr_val_from_lc_changed = True

                    if attr_val_from_lc_changed:
                        lc.save()
                        logger.info("LC %s successfully updated." % lc_number)
                    else:
                        logger.info("LC %s: nothing has changed, no update required" % lc_number)

        return redirect(admin_url(LCRegister))
