import django_filters
from rest_framework import generics
from letter_of_credit.models import LCRegister
from letter_of_credit.serializers import LetterOfCreditRegisterSerializer
import logging

logger = logging.getLogger('recons_logger')


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
        logger.info('Creating new letter of credit with incoming data = \n%r', request.data)
        return super(LetterOfCreditRegisterListCreateAPIView, self).create(request, *args, **kwargs)


class LetterOfCreditRegisterUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LCRegister.objects.all()
    serializer_class = LetterOfCreditRegisterSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(LetterOfCreditRegisterUpdateAPIView, self).update(request, *args, **kwargs)
