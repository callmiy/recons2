import django_filters
from rest_framework import generics
from letter_of_credit.models import LetterOfCredit, LcStatus
from letter_of_credit.serializers import LetterOfCreditSerializer, LCStatusSerializer
import logging

logger = logging.getLogger('recons_logger')


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


class LetterOfCreditFilter(django_filters.FilterSet):
    lc_ref = django_filters.CharFilter(lookup_type='istartswith')
    applicant = django_filters.CharFilter(name='applicant__name', lookup_type='icontains')
    released = django_filters.CharFilter(action=LetterOfCredit.released)
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
