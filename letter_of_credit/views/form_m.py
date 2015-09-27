from django.shortcuts import render
from rest_framework import generics, pagination
import django_filters
from core_recons.views import CoreAppsView
from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete, LcBidRequest
from letter_of_credit.serializers import (
    FormMSerializer,
    LCIssueSerializer,
    LCIssueConcreteSerializer,
    LcBidRequestSerializer
)

import logging

logger = logging.getLogger('recons_logger')


class LcBidRequestPagination(pagination.PageNumberPagination):
    page_size = 20


class LcBidRequestFilter(django_filters.FilterSet):
    pending = django_filters.CharFilter(action=LcBidRequest.search_pending)

    class Meta:
        model = LcBidRequest
        fields = ('pending',)


class LcBidRequestListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LcBidRequestSerializer
    queryset = LcBidRequest.objects.all()
    pagination_class = LcBidRequestPagination
    filter_class = LcBidRequestFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit bid request with incoming data = \n%r', request.data)
        return super(LcBidRequestListCreateAPIView, self).create(request, *args, **kwargs)


class LcBidRequestUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LcBidRequest.objects.all()
    serializer_class = LcBidRequestSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit bid request with incoming data = \n%r', request.data)
        return super(LcBidRequestUpdateAPIView, self).update(request, *args, **kwargs)


class LCIssueConcreteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LCIssueConcreteSerializer
    queryset = LCIssueConcrete.objects.all()

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueConcreteListCreateAPIView, self).create(request, *args, **kwargs)


class LCIssueConcreteUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCIssueConcrete.objects.all()
    serializer_class = LCIssueConcreteSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueConcreteUpdateAPIView, self).update(request, *args, **kwargs)


class LCIssueListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LCIssueSerializer
    queryset = LCIssue.objects.all()

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit issue with incoming data = \n%r', request.data)
        return super(LCIssueListCreateAPIView, self).create(request, *args, **kwargs)


class LCIssueUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCIssue.objects.all()
    serializer_class = LCIssueSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(LCIssueUpdateAPIView, self).update(request, *args, **kwargs)


class FormMListPagination(pagination.PageNumberPagination):
    page_size = 20


class FormMFilter(django_filters.FilterSet):
    number = django_filters.CharFilter(lookup_type='icontains')
    applicant = django_filters.CharFilter(name='applicant__name', lookup_type='icontains')
    currency = django_filters.CharFilter(name='currency__code', lookup_type='iexact')
    lc_not_attached = django_filters.CharFilter(action=FormM.lc_not_attached_filter)
    filter = django_filters.CharFilter(action=FormM.search_filter)

    class Meta:
        model = FormM
        fields = ('number', 'applicant', 'currency', 'filter', 'lc_not_attached')


class FormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FormMSerializer
    queryset = FormM.objects.all()
    pagination_class = FormMListPagination
    filter_class = FormMFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new form M with incoming data = \n%r', request.data)
        return super(FormMListCreateAPIView, self).create(request, *args, **kwargs)


class FormMUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormM.objects.all()
    serializer_class = FormMSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating form M with incoming data = \n%r', request.data)
        return super(FormMUpdateAPIView, self).update(request, *args, **kwargs)


class FormMHomeView(CoreAppsView):
    def get(self, request):
        template_context = {'urls': self.get_core_app_urls()}

        return render(request, 'letter_of_credit/form_m/index.html', template_context)
