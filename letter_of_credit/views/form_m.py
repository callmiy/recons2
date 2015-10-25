import json
from django.db.models import Q
from rest_framework import generics, pagination, status
import django_filters
from rest_framework.response import Response
from letter_of_credit.models import FormM, FormMCover
from letter_of_credit.serializers import (
    FormMSerializer,
    LcBidRequestSerializer,
    LCIssueConcreteSerializer,
    FormMCoverSerializer
)
import logging
import re

logger = logging.getLogger('recons_logger')
URL_RE = re.compile(r'.+/(\d+)$')


class FormMCoverListCreateAPIView(generics.ListCreateAPIView):
    queryset = FormMCover.objects.all()
    serializer_class = FormMCoverSerializer

    def create(self, request, *args, **kwargs):
        logger.info('Creating form m cover with incoming data: %s', json.dumps(request.data, indent=4))
        return super(FormMCoverListCreateAPIView, self).create(request, *args, **kwargs)


class FormMCoverRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormMCover.objects.all()
    serializer_class = FormMCoverSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating form m cover with incoming data: %s', json.dumps(request.data, indent=4))
        return super(FormMCoverRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)


class FormMListPagination(pagination.PageNumberPagination):
    page_size = 20


class FormMFilter(django_filters.FilterSet):
    number = django_filters.CharFilter(lookup_type='icontains')
    applicant = django_filters.CharFilter(name='applicant__name', lookup_type='icontains')
    currency = django_filters.CharFilter(name='currency__code', lookup_type='iexact')
    lc_not_attached = django_filters.MethodFilter()
    filter = django_filters.MethodFilter()

    class Meta:
        model = FormM
        fields = ('number', 'applicant', 'currency', 'filter', 'lc_not_attached')

    def filter_lc_not_attached(self, qs, param):
        if not param:
            return qs

        param = True if param == 'true' else False

        return qs.filter(lc__isnull=param)

    def filter_filter(self, qs, param):
        if not param:
            return qs

        return qs.filter(Q(number__icontains=param) | Q(applicant__name__icontains=param))


class FormIssueBidCoverUtil:
    """
    Utility class for handling cases where form M will be created/updated simultaneously with bid and or issues
    """

    def __init__(self, request, form_m_url, log_prefix=None):
        self.request = request
        self.form_m_url = form_m_url
        self.log_prefix = log_prefix

    def create_bid(self, amount):
        logger.info('{} creating bid for amount "{:,.2f}"'.format(self.log_prefix, amount))

        serializer = LcBidRequestSerializer(data={'amount': amount, 'mf': self.form_m_url},
                                            context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        logger.info('{} bid successfully created:\n{}'.format(self.log_prefix, json.dumps(data, indent=4)))
        return data

    def create_issues(self, issues):
        logger.info('{} creating form M issues: {:}'.format(self.log_prefix, issues))
        data = []
        for issue in issues:
            data.append({'issue': issue['url'], 'mf': self.form_m_url})

        serializer = LCIssueConcreteSerializer(data=data, context={'request': self.request}, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        issues = []
        # we need to do this because the structure of FormMSerializer['form_m_issues'] (the LCIssueConcreteSerializer
        # data that is nested into FormMSerializer) differs from vanilla LCIssueConcreteSerializer
        for issue in serializer.data:
            issues.append({
                'closed_at': issue['closed_at'],
                'created_at': issue['created_at'],
                'id': issue['id'],
                'url': issue['url'],
                'issue': {
                    'text': issue['issue_text'],
                    'url': issue['issue'],
                    'id': int(URL_RE.search(issue['issue']).group(1))
                }
            })
        logger.info('{} form M issues successfully created:\n{}'.format(self.log_prefix, json.dumps(issues, indent=4)))
        return issues

    def create_cover(self, cover):
        logger.info('{} creating form M cover with data\n{}'.format(self.log_prefix, cover))
        cover['mf'] = self.form_m_url
        serializer = FormMCoverSerializer(data=cover, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        logger.info('{} form m cover successfully created:\n{}'.format(self.log_prefix, json.dumps(data, indent=4)))
        # we do this because form M displays only a subset of data from form M cover serializer (much of the data
        # is already part of form m serializer)
        return {
            'amount': data['amount'],
            'cover_type': data['cover_type'],
            'cover_label': data['cover_label'],
            'received_at': data['received_at']
        }


class FormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FormMSerializer
    queryset = FormM.objects.all()
    pagination_class = FormMListPagination
    filter_class = FormMFilter

    def __init__(self, **kwargs):
        self.log_prefix = 'Creating new form M:'
        super(FormMListCreateAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        incoming_data = request.data
        logger.info('%s with incoming data = \n%r', self.log_prefix, json.dumps(incoming_data, indent=4))

        serializer = self.get_serializer(data=incoming_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        form_m_data = serializer.data

        util = FormIssueBidCoverUtil(request, form_m_data['url'], self.log_prefix)
        if 'bid' in incoming_data:
            form_m_data['bid'] = util.create_bid(incoming_data['bid']['amount'])

        if 'cover' in incoming_data:
            form_m_data['cover'] = util.create_cover(incoming_data['cover'])

        if 'issues' in incoming_data:
            form_m_data['form_m_issues'] += util.create_issues(incoming_data['issues'])

        headers = self.get_success_headers(form_m_data)
        return Response(form_m_data, status=status.HTTP_201_CREATED, headers=headers)


class FormMRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormM.objects.all()
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
            form_m_data['cover'] = util.create_cover(incoming_data['cover'])

        if 'bid' in incoming_data:
            form_m_data['bid'] = util.create_bid(incoming_data['bid']['amount'])

        if 'issues' in incoming_data:
            form_m_data['form_m_issues'] += util.create_issues(incoming_data['issues'])

        return Response(form_m_data)
