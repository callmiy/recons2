from django.shortcuts import render
from rest_framework import generics
from core_recons.views import CoreAppsView
from letter_of_credit.models import FormM
from letter_of_credit.serializers import FormMSerializer

import logging

logger = logging.getLogger('recons_logger')


class FormMListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FormMSerializer
    queryset = FormM.objects.all()
    # filter_class = FormMFilter

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
