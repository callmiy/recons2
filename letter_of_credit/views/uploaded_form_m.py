import json
from django.shortcuts import render, redirect
import django_filters
from rest_framework import generics, status
from rest_framework.response import Response
from core_recons.utilities import admin_url
from letter_of_credit.models import UploadedFormM
from letter_of_credit.serializers import UploadedFormMSerializer
from django.views.generic import View
import logging

logger = logging.getLogger('recons_logger')


class UploadedFormMFilter(django_filters.FilterSet):
    mf = django_filters.CharFilter(lookup_type='icontains')
    ba = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = UploadedFormM
        fields = ('mf', 'ba')


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
                        json.dumps(datum, indent=4)
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
        logger.info('%s with incoming data = \n%r', self.log_prefix, json.dumps(request.data, indent=4))

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
        logger.info('Updating letter of credit with incoming data = \n%r', json.dumps(request.data, indent=4))
        return super(UploadedFormMUpdateAPIView, self).update(request, *args, **kwargs)


class UploadFromSingleWindowView(View):
    def get(self, request):
        return render(request, 'letter_of_credit/uploaded-form-m/uploaded-form-m.html', )

    def post(self, request):
        text = request.POST['upload-lc-register'].strip()

        if text:
            for row in json.loads(text):
                if not UploadedFormM.objects.filter(
                        mf=row['mf'], ba=row['ba'], ccy=row['ccy'],
                        validity_type=row['validity_type'], status=row['status']).exists():
                    UploadedFormM.objects.create(**row)
        return redirect(admin_url(UploadedFormM))
