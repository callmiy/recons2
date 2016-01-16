import json
import logging
import re

import django_filters
from django.db.models import Q
from rest_framework import generics, pagination, status
from rest_framework.response import Response

from letter_of_credit.models import FormM
from letter_of_credit.serializers import (
    FormMSerializer,
    LcBidRequestSerializer,
    LCIssueConcreteSerializer,
    FormMCoverSerializer
)

logger = logging.getLogger('recons_logger')
URL_RE = re.compile(r'.+/(\d+)$')


class FormMListPagination(pagination.PageNumberPagination):
    page_size = 20


class FormMFilter(django_filters.FilterSet):
    number = django_filters.CharFilter(lookup_type='icontains')
    applicant = django_filters.CharFilter(name='applicant__name', lookup_type='icontains')
    applicant_id = django_filters.CharFilter(name='applicant__id', )
    lc_number = django_filters.CharFilter(name='lc__lc_number', lookup_type='icontains', )
    currency = django_filters.CharFilter(name='currency__code', lookup_type='iexact')
    lc_not_attached = django_filters.MethodFilter()
    filter = django_filters.MethodFilter()
    amount = django_filters.MethodFilter()

    class Meta:
        model = FormM
        fields = ('number', 'applicant', 'currency', 'filter', 'lc_not_attached', 'amount',)

    def filter_lc_not_attached(self, qs, param):
        if not param:
            return qs

        param = True if param == 'true' else False

        return qs.filter(lc__isnull=param)

    def filter_filter(self, qs, param):
        if not param:
            return qs

        return qs.filter(Q(number__icontains=param) | Q(applicant__name__icontains=param))

    def filter_amount(self, qs, param):
        if not param:
            return qs

        try:
            return qs.filter(amount=param.strip().replace(',', ''))
        except ValueError:
            return qs


class FormIssueBidCoverUtil:
    """
    Utility class for handling cases where form M will be created/updated simultaneously with bid and or issues
    """

    def __init__(self, request, form_m_url, log_prefix=None):
        self.request = request
        self.form_m_url = form_m_url
        self.log_prefix = log_prefix

    def create_bid(self, bid):
        if len(bid):
            log = {'amount': "{:,.2f}".format(bid['amount']), 'maturity': bid['maturity']}
            logger.info('%s creating bid with data:\n%s', self.log_prefix, json.dumps(log, indent=4))

            bid.update({'mf': self.form_m_url})
            serializer = LcBidRequestSerializer(data=bid, context={'request': self.request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            data = serializer.data
            logger.info('{} bid successfully created:\n{}'.format(self.log_prefix, json.dumps(data, indent=4)))

    def create_issues(self, issues):
        logger.info('%s creating form M issues with data:\n%s', self.log_prefix, json.dumps(issues, indent=4))
        data = []
        for issue in issues:
            data.append({'issue': issue['url'], 'mf': self.form_m_url})

        serializer = LCIssueConcreteSerializer(data=data, context={'request': self.request}, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        results = serializer.data

        logger.info('%s form M issues successfully created:\n%s', self.log_prefix, json.dumps(results, indent=4))
        return results

    def create_cover(self, cover):
        logger.info('%s creating form M cover with data\n%s', self.log_prefix, cover)
        cover['mf'] = self.form_m_url
        serializer = FormMCoverSerializer(data=cover, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        logger.info('%s form m cover successfully created:\n%s', self.log_prefix, json.dumps(data, indent=4))


class FormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FormMSerializer
    queryset = FormM.not_deleted.all()
    pagination_class = FormMListPagination
    filter_class = FormMFilter

    def __init__(self, **kwargs):
        self.log_prefix = 'Creating new form M:'
        super(FormMListCreateAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', self.log_prefix, json.dumps(incoming_data, indent=4))

        serializer = self.get_serializer(data=incoming_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        form_m_data = serializer.data
        headers = self.get_success_headers(form_m_data)

        util = FormIssueBidCoverUtil(request, form_m_data['url'], self.log_prefix)
        if 'bid' in incoming_data:
            util.create_bid(incoming_data['bid'])

        if 'cover' in incoming_data:
            util.create_cover(incoming_data['cover'])

        if 'issues' in incoming_data:
            form_m_data['new_issues'] = util.create_issues(incoming_data['issues'])

        logger.info('%s Form m successfully created. Data will be sent to client:\n%s', self.log_prefix,
                    json.dumps(form_m_data, indent=4))
        return Response(form_m_data, status=status.HTTP_201_CREATED, headers=headers)


class FormMRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormM.not_deleted.all()
    serializer_class = FormMSerializer

    def __init__(self, **kwargs):
        self.log_prefix = 'Updating form M:'
        super(FormMRetrieveUpdateDestroyAPIView, self).__init__(**kwargs)

    def update(self, request, *args, **kwargs):
        incoming_data = request.data
        logger.info('%s with incoming data: \n%s', self.log_prefix, json.dumps(incoming_data, indent=4))

        if incoming_data.get('do_not_update', False):
            logger.info('%s form M will not be updated because incoming data contains "do_not_update" flag.',
                        self.log_prefix)
            form_m_data = incoming_data
        else:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=incoming_data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            form_m_data = serializer.data
            logger.info('%s form m successfully updated: \n%s', self.log_prefix, json.dumps(form_m_data, indent=4))

        util = FormIssueBidCoverUtil(request, form_m_data['url'], self.log_prefix)
        if 'cover' in incoming_data:
            util.create_cover(incoming_data['cover'])
            if 'cover' in form_m_data:
                del form_m_data['cover']

        if 'bid' in incoming_data:
            util.create_bid(incoming_data['bid'])
            if 'bid' in form_m_data:
                del form_m_data['bid']

        if 'issues' in incoming_data:
            form_m_data['new_issues'] = util.create_issues(incoming_data['issues'])
            if 'issues' in form_m_data:
                del form_m_data['issues']

        return Response(form_m_data)
