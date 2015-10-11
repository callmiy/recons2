from rest_framework import generics
from letter_of_credit.models import LCIssue, LCIssueConcrete, FormM
from letter_of_credit.serializers import LCIssueSerializer, LCIssueConcreteSerializer, FormMSerializer
import django_filters

import logging

logger = logging.getLogger('recons_logger')


class LCIssueConcreteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LCIssueConcreteSerializer
    queryset = LCIssueConcrete.objects.all()

    def create(self, request, *args, **kwargs):
        logger_prefix = 'Creating new letter of credit issue:'
        logger.info('%s with incoming data = \n%r', logger_prefix, request.data)

        form_m_data = request.data.get('form_m_data')
        if form_m_data:
            mf_number = form_m_data['number']
            logger.info('%s issue did not previously have associated form M, creating form M: %s', logger_prefix,
                        mf_number)

            request.data['mf'] = self.create_form_m(form_m_data)

            logger.info('%s form M "%s" successfully created.\n LC issue will be created with new data: %r',
                        logger_prefix, mf_number, request.data)

        elif 'get_form_m' in request.data:
            request.data['mf'] = FormM.objects.get(number=request.data['mf']).get_url()

        return super(LCIssueConcreteListCreateAPIView, self).create(request, *args, **kwargs)

    def create_form_m(self, form_m_data):
        mf = FormMSerializer(data=form_m_data).save()
        return mf.get_url()


class LCIssueConcreteUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCIssueConcrete.objects.all()
    serializer_class = LCIssueConcreteSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueConcreteUpdateAPIView, self).update(request, *args, **kwargs)


class LcIssueFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_type='icontains')
    exclude_form_issues = django_filters.MethodFilter()

    class Meta:
        model = LCIssue
        fields = ('text', 'exclude_form_issues',)

    def filter_exclude_form_issues(self, qs, value):
        if value:
            form_m = FormM.objects.filter(number=value)
            if form_m.exists():
                _ids = []
                for issue in form_m[0].form_m_issues.filter():
                    _ids.append(issue.issue.pk)

                if len(_ids):
                    return qs.exclude(pk__in=_ids)
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
