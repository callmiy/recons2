import django_filters
from rest_framework import generics, pagination
from letter_of_credit.models import LCRegister, FormM
from letter_of_credit.serializers import LetterOfCreditRegisterSerializer
import json
from django.views.generic import View
from django.shortcuts import render, redirect
from adhocmodels.models import Currency
from core_recons.csv_utilities import UploadCSVParserUtility
import logging

logger = logging.getLogger('recons_logger')
admin_url = lambda cls: '/admin/%s/' % str(getattr(cls, '_meta')).replace('.', '/')


class LetterOfCreditRegisterPagination(pagination.PageNumberPagination):
    page_size = 20


class LetterOfCreditRegisterFilter(django_filters.FilterSet):
    lc_number = django_filters.CharFilter(lookup_type='icontains')
    applicant = django_filters.CharFilter(name='applicant', lookup_type='icontains')
    mf = django_filters.CharFilter(lookup_type='istartswith')

    class Meta:
        model = LCRegister
        fields = ('lc_number', 'applicant', 'mf',)


class LetterOfCreditRegisterListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LetterOfCreditRegisterSerializer
    queryset = LCRegister.objects.all()
    filter_class = LetterOfCreditRegisterFilter
    pagination_class = LetterOfCreditRegisterPagination

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit with incoming data = \n%r', request.data)
        return super(LetterOfCreditRegisterListCreateAPIView, self).create(request, *args, **kwargs)


class LetterOfCreditRegisterUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCRegister.objects.all()
    serializer_class = LetterOfCreditRegisterSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(LetterOfCreditRegisterUpdateAPIView, self).update(request, *args, **kwargs)


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

    def update_only_if_lc_changed(self, lc_number, lc_qs, data):
        """
        Update an LC only if it has been amended

        Checks if the attributes of the lc being uploaded (the key in the `data` object) is the same as that of
        the lc retrieved from the database and then do any update only if something has changed

        :param lc_number: str
        :param lc_qs: django
        :param data: dict
        :rtype :
        """
        lc_obj = lc_qs[0]

        attr_val_from_lc_changed = False

        for key in data:
            if key == 'mf':  # don't update form M number
                continue
            client_attr_val = data[key]
            lc_attr_val = getattr(lc_obj, key, None)

            if key == "lc_amt_org_ccy":
                lc_attr_val = round(float(lc_attr_val), 2)  # lc_attr_val was originally decimal

            if client_attr_val != lc_attr_val:
                logger.info(
                    'LC %s: attribute "%s" has changed from "%s" to "%s". It will be updated' % (
                        lc_number, key, lc_attr_val, client_attr_val)
                )

                setattr(lc_obj, key, client_attr_val)
                attr_val_from_lc_changed = True

        if attr_val_from_lc_changed:
            lc_obj.save()
            logger.info("LC %s successfully updated." % lc_number)
        else:
            logger.info("LC %s: nothing has changed, no update required" % lc_number)
        return lc_obj

    def post(self, request):
        uploaded_text = request.POST['upload-lc-register-text'].strip(' \n\r')

        logger.info("Raw data received from client:\n%s" % uploaded_text)

        if uploaded_text:
            parser_utility = UploadCSVParserUtility()

            for data in json.loads(uploaded_text):
                logger.info('About to create or update lc using raw data from client:\n%s' % data)

                data["expiry_date"] = parser_utility.normalize_date(data["expiry_date"])
                data["estb_date"] = parser_utility.normalize_date(data["estb_date"])
                data['ccy_obj'] = Currency.objects.get(code=data['ccy_obj'])
                data["lc_amt_org_ccy"] = round(float(data["lc_amt_org_ccy"].replace(',', '')), 2)

                logger.info('About to create or update lc after raw data from client cleaned up:\n%s' % data)

                lc_number = data['lc_number']

                logger.info("Checking if LC %s exists in database" % lc_number)
                lc_qs = LCRegister.objects.filter(lc_number=lc_number)

                if not lc_qs.exists():
                    logger.info("LC %s does not exist in database, it will be created" % lc_number)
                    lc_obj = LCRegister.objects.create(**data)
                    logger.info("LC %s successfully created." % lc_number)

                else:
                    logger.info(
                        "LC %s exists in database, it will be updated if at least one attribute value has changed" %
                        lc_number
                    )

                    lc_obj = self.update_only_if_lc_changed(lc_number, lc_qs, data)

                form_m_qs = FormM.objects.filter(number=data['mf'])

                if form_m_qs.exists():
                    logger.info('LC %s: if form M was not previously attached, form M "%s" will now be attached.' % (
                    lc_number, data['mf']))
                    form_m_qs[0].attach_lc(lc=lc_obj)

        return redirect(admin_url(LCRegister))
