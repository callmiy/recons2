from django.shortcuts import render
import django_filters
from rest_framework import generics
from letter_of_credit.models import LetterOfCredit, LcStatus, LCRegister
from letter_of_credit.serializers import (
    LetterOfCreditSerializer,
    LCStatusSerializer,
    LetterOfCreditRegisterSerializer
)
from core_recons.views import CoreAppsView

import logging
logger = logging.getLogger('recons_logger')


class Home(CoreAppsView):
    def get(self, request):
        template_context = {'urls': self.get_core_app_urls()}

        return render(request, 'letter_of_credit/index.html', template_context)


class LcStatusFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = LcStatus
        fields = ('text',)


class LCStatusListCreateAPIView(generics.ListCreateAPIView):
    queryset = LcStatus.objects.all()
    serializer_class = LCStatusSerializer
    filter_class = LcStatusFilter

    def create(self, request, *args, **kwargs):
        logger.info('incoming data = \n%r', request.DATA)
        return super(LCStatusListCreateAPIView, self).create(request, *args, **kwargs)


class LCStatusUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LcStatus.objects.all()
    serializer_class = LCStatusSerializer

    def update(self, request, *args, **kwargs):
        logger.info('incoming data = \n%r', request.DATA)
        return super(LCStatusUpdateAPIView, self).update(request, *args, **kwargs)


def released(qs, releasedOnly):
    if not releasedOnly:
        return qs

    if releasedOnly == 'True':
        return qs.filter(date_released__isnull=False)

    return qs.filter(date_released__isnull=True)


class LetterOfCreditFilter(django_filters.FilterSet):
    lc_ref = django_filters.CharFilter(lookup_type='istartswith')
    applicant = django_filters.CharFilter(name='applicant__name', lookup_type='icontains')
    released = django_filters.CharFilter(action=released)
    mf = django_filters.CharFilter(lookup_type='istartswith')

    class Meta:
        model = LetterOfCredit
        fields = ('lc_ref', 'applicant', 'released',)


class LetterOfCreditListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LetterOfCreditSerializer
    queryset = LetterOfCredit.objects.all()
    filter_class = LetterOfCreditFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit with incoming data = \n%r', request.DATA)
        return super(LetterOfCreditListCreateAPIView, self).create(request, *args, **kwargs)


class LetterOfCreditUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LetterOfCredit.objects.all()
    serializer_class = LetterOfCreditSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.DATA)
        return super(LetterOfCreditUpdateAPIView, self).update(request, *args, **kwargs)


class LetterOfCreditRegisterFilter(django_filters.FilterSet):
    lc_number = django_filters.CharFilter(lookup_type='istartswith')
    applicant = django_filters.CharFilter(name='applicant', lookup_type='icontains')
    mf = django_filters.CharFilter(lookup_type='istartswith')

    class Meta:
        model = LCRegister
        fields = ('lc_number', 'applicant', 'mf',)


class LetterOfCreditRegisterListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LetterOfCreditRegisterSerializer
    queryset = LCRegister.objects.all()
    filter_class = LetterOfCreditRegisterFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new letter of credit with incoming data = \n%r', request.DATA)
        return super(LetterOfCreditRegisterListCreateAPIView, self).create(request, *args, **kwargs)


class LetterOfCreditRegisterUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCRegister.objects.all()
    serializer_class = LetterOfCreditRegisterSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.DATA)
        return super(LetterOfCreditRegisterUpdateAPIView, self).update(request, *args, **kwargs)
