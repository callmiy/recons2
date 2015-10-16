import django_filters
from rest_framework import generics
from letter_of_credit.models import UploadedFormM
from letter_of_credit.serializers import UploadedFormMSerializer
import logging

logger = logging.getLogger('recons_logger')


class UploadedFormMFilter(django_filters.FilterSet):
    class Meta:
        model = UploadedFormM
        fields = {
            'ba': ('icontains',),
            'mf': ('icontains',),
            'ccy': ('iexact',),
            'applicant': ('icontains',),
            'submitted_at': ('lte', 'gte'),
            'validated_at': ('lte', 'gte'),
            'uploaded_at': ('lte', 'gte'),
        }


class UploadedFormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = UploadedFormMSerializer
    queryset = UploadedFormM.objects.all()
    filter_class = UploadedFormMFilter

    def __init__(self, **kwargs):
        self.log_prefix = 'Creating form M uploaded from single window:'
        super(UploadedFormMListCreateAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        data = request.data
        logger.info('%s with incoming data = \n%r', self.log_prefix, data)

        if 'likely_duplicates' in data:
            logger.info('%s data likely contains duplicates - will be weeded out', self.log_prefix)

            fresh_data_list = []
            duplicate_count = 0

            for datum in data:
                if UploadedFormM.objects.filter(mf=datum['mf']).exists():
                    duplicate_count += 1
                    logger.info('%s duplicate found - %r', datum)
                else:
                    fresh_data_list.append(datum)
            logger.info('%s number of duplicates - %d', duplicate_count)
            request.data = fresh_data_list

        return super(UploadedFormMListCreateAPIView, self).create(request, *args, **kwargs)


class UploadedFormMUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UploadedFormM.objects.all()
    serializer_class = UploadedFormMSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(UploadedFormMUpdateAPIView, self).update(request, *args, **kwargs)
