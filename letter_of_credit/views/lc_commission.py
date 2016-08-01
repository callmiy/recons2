import json
import logging

from django.shortcuts import render
from django.views.generic import View

from core_recons.csv_utilities import UploadCSVParserUtility
from letter_of_credit.models import LCRegister, LcCommission

logger = logging.getLogger('recons_logger')


class UploadLcCommissionView(View):
    LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING = {
        'Transaction Ref': 'lc_ref',
        'Transaction Amount': 'transaction_amount',
        'Charge Amount': 'charge_amount',
        'EXCH_RATE': 'exchange_rate',
        'Charge date': 'charge_date',
        'Percent Applied': 'percent_applied',
        'REFNO_PFIX': 'event',
        'ACCT NUM': 'acct_numb',
    }

    def get(self, request, commission_upload_status=''):
        return render(
                request,
                'letter_of_credit/lc_commission/lc-commission-upload.html',
                {
                    'LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING': json.dumps(
                            self.LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING),
                    'commission_upload_status': commission_upload_status}
        )

    def post(self, request):
        log_prefix = 'About to create lc commission: '
        uploaded_text = request.POST['upload-lc-commission'].strip(' \n\r')
        logger.info("%s raw data received from client:\n%s", log_prefix, uploaded_text)
        commission_upload_status = None

        if uploaded_text:
            list_lc_not_uploaded = []
            created_commission_count = 0
            parser_utility = UploadCSVParserUtility()

            for data in json.loads(uploaded_text):
                logger.info('%s using raw data from client:\n%s', log_prefix, data)
                lc_number = data['lc_ref'].strip(' \n\r')
                lc_qs = LCRegister.objects.filter(lc_number=lc_number)
                lc = None

                if lc_qs.exists():
                    logging.info('%s LC already exists in database and commission will be created: %s', log_prefix,
                                 lc_number)
                    lc = lc_qs[0]
                    if not lc.acct_numb:
                        lc.acct_numb = data['acct_numb']
                        lc.save()
                else:
                    list_lc_not_uploaded.append(lc_number)
                    logging.warn('%s LC does not exist yet in database: %s', log_prefix, lc_number)
                    continue

                data["charge_date"] = parser_utility.normalize_date(data["charge_date"])
                data["charge_amount"] = round(float(data["charge_amount"].strip(' \n\r').replace(',', '')), 2)
                data["transaction_amount"] = round(float(data["transaction_amount"].strip(' \n\r').replace(',', '')), 2)
                logger.info('%s LC commission will be created with data: %s', log_prefix, data)
                del data['lc_ref']
                data['lc'] = lc_qs[0]
                LcCommission.objects.create(**data)
                created_commission_count += 1

            if created_commission_count or list_lc_not_uploaded:
                commission_upload_status = 'Total uploaded: %d' % created_commission_count

                if list_lc_not_uploaded:
                    commission_upload_status = '%s\n\n\n\nLC not in database: %s' % (
                        commission_upload_status, json.dumps(list_lc_not_uploaded)
                    )

        return self.get(request, commission_upload_status=commission_upload_status)
