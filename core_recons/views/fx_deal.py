import json
import logging
from rest_framework import generics
import django_filters

from core_recons.models import FxDeal
from core_recons.serializers import FxDealSerializer

logger = logging.getLogger('recons_logger')


class FxDealFilter(django_filters.FilterSet):
    ct = django_filters.CharFilter(name='content_type__pk')
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()

    class Meta:
        model = FxDeal
        fields = ('ct', 'pk',)

    def filter_not_deleted(self, qs, param):
        if param == 'true':
            return qs.filter(deleted_at__isnull=True)

        if param == 'false':
            return qs.filter(deleted_at__isnull=False)

        return qs


def update_object_instance(serialization_response):
    data = serialization_response.data
    deal = FxDeal.objects.get(id=data['id'])
    data['model_class'] = str(deal.object_instance._meta.model)
    return data


class FxDealListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = FxDealSerializer
    queryset = FxDeal.objects.all()
    filter_class = FxDealFilter

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new fx deal:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(FxDealListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s fx deal created successfully, result is:\n%s', log_prefix,
                    json.dumps(update_object_instance(response), indent=4))
        return response


class FxDealRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FxDeal.objects.all()
    serializer_class = FxDealSerializer

    def update(self, request, *args, **kwargs):
        log_prefix = 'Update fx deal:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(FxDealRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
        logger.info('%s fx deal updated successfully, result is:\n%s', log_prefix,
                    json.dumps(update_object_instance(response), indent=4))
        return response
