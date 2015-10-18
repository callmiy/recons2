import django_filters
from rest_framework import generics, status
from rest_framework.response import Response
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

    def create_with_likely_duplicates(self, request, *args, **kwargs):
        logger.info(
            '%s data likely contains form Ms that had been uploaded previously - will be deleted from incoming '
            'data',
            self.log_prefix
        )

        duplicate_count = 0
        fresh_data_list = []

        for index, datum in enumerate(request.data['uploaded']):
            if UploadedFormM.objects.filter(mf=datum['mf']).exists():
                duplicate_count += 1
                logger.info(
                    '%s form M uploaded previously, will be deleted from incoming data:\n%r',
                    self.log_prefix,
                    datum
                )
            else:
                fresh_data_list.append(datum)

        logger.info(
            '%s number of previously uploaded form Ms deleted from incoming data - %d', self.log_prefix,
            duplicate_count)

        logger.info(
            '%s incoming data has been cleaned - actual creation will be done with data: \n%r', self.log_prefix,
            fresh_data_list)

        serializer = self.get_serializer(data=fresh_data_list, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

    def create(self, request, *args, **kwargs):
        logger.info('%s with incoming data = \n%r', self.log_prefix, request.data)

        # if we are doing a bulk create and at the same time incoming data is likely to contain form Ms we had
        # created previously, then request.data will look like:
        # {
        #     'likely_duplicates': true,
        #     'uploaded': [{uploaded form M to be created data},
        #                   {uploaded form M to be created data},]
        # }
        if 'likely_duplicates' in request.data:
            return self.create_with_likely_duplicates(request, *args, **kwargs)

        return super(UploadedFormMListCreateAPIView, self).create(request, *args, **kwargs)


class UploadedFormMUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UploadedFormM.objects.all()
    serializer_class = UploadedFormMSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating letter of credit with incoming data = \n%r', request.data)
        return super(UploadedFormMUpdateAPIView, self).update(request, *args, **kwargs)
