import datetime
from rest_framework import generics, status
from rest_framework.response import Response
from letter_of_credit.models import LCIssue, LCIssueConcrete, FormM
from letter_of_credit.serializers import LCIssueSerializer, LCIssueConcreteSerializer, FormMSerializer
import django_filters

import logging

logger = logging.getLogger('recons_logger')


class LCIssueConcreteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LCIssueConcreteSerializer
    queryset = LCIssueConcrete.objects.all()

    def __init__(self, **kwargs):
        self.logger_prefix = 'Creating new letter of credit issue:'
        super(LCIssueConcreteListCreateAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        logger.info('%s with incoming data = \n%r', self.logger_prefix, request.data)

        if 'get_or_create_form_m' in request.data:
            form_m = FormM.objects.filter(number=request.data['mf'])
            if form_m.exists():
                form_m = form_m[0]
                form_m.attach_lc(lc_number=request.data['lc_number'])
                request.data['mf'] = form_m.get_url()

            else:
                form_m_data = request.data.get('form_m_data')
                if form_m_data:
                    mf_number = form_m_data['number']
                    logger.info('%s issue did not previously have associated form M, creating form M: %s',
                                self.logger_prefix, mf_number)
                    form_m_create_result = self.create_form_m(form_m_data)
                    if not form_m_create_result['created']:
                        errors = form_m_create_result['errors']
                        errors['form_m_creation_errors'] = True
                        logger.info('%s form M "%s" could not be created.Error is: %r', errors)
                        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

                    request.data['mf'] = form_m_create_result['url']
                    logger.info('%s form M "%s" successfully created.\n LC issue will be created with new data: %r',
                                self.logger_prefix, mf_number, request.data)

        return super(LCIssueConcreteListCreateAPIView, self).create(request, *args, **kwargs)

    def create_form_m(self, form_m_data):
        if 'date_received' not in form_m_data:
            form_m_data['date_received'] = datetime.date.today().strftime('%Y-%m-%d')

        logger.info('%s form M will be created with data: %r', self.logger_prefix, form_m_data)
        mf_created = FormMSerializer(data=form_m_data)
        if mf_created.is_valid():
            mf = mf_created.save()
            return {'created': True, 'url': mf.get_url()}

        return {'created': False, 'errors': mf_created.errors}


class LCIssueConcreteUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCIssueConcrete.objects.all()
    serializer_class = LCIssueConcreteSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueConcreteUpdateAPIView, self).update(request, *args, **kwargs)


class LcIssueFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_type='icontains')
    exclude_form_m_issues = django_filters.MethodFilter()
    exclude_issue_ids = django_filters.MethodFilter()

    class Meta:
        model = LCIssue
        fields = ('text', 'exclude_form_m_issues',)

    def filter_exclude_form_m_issues(self, qs, value):
        if value:
            form_m = FormM.objects.filter(number=value)
            if form_m.exists():
                _ids = []
                for issue in form_m[0].form_m_issues.filter():
                    _ids.append(issue.issue.pk)

                if len(_ids):
                    return qs.exclude(pk__in=_ids)
        return qs

    def filter_exclude_issue_ids(self, qs, value):
        if value:
            return qs.exclude(pk__in=value.split(','))
        return qs


class LCIssueListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LCIssueSerializer
    queryset = LCIssue.objects.all()
    filter_class = LcIssueFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueListCreateAPIView, self).create(request, *args, **kwargs)


class LCIssueUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCIssue.objects.all()
    serializer_class = LCIssueSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(LCIssueUpdateAPIView, self).update(request, *args, **kwargs)
