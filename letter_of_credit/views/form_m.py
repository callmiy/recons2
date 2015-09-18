from rest_framework import generics
from letter_of_credit.models import FormM
from letter_of_credit.serializers import FormMSerializer

import logging

logger = logging.getLogger('recons_logger')


class FormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FormMSerializer
    queryset = FormM.objects.all()
    # filter_class = FormMFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating new form M with incoming data = \n%r', request.DATA)
        return super(FormMListCreateAPIView, self).create(request, *args, **kwargs)


class FormMUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormM.objects.all()
    serializer_class = FormMSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating form M with incoming data = \n%r', request.DATA)
        return super(FormMUpdateAPIView, self).update(request, *args, **kwargs)
