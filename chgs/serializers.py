from rest_framework.serializers import ModelSerializer
from .models import Charge


class ChargeSerializer(ModelSerializer):

    class Meta:
        model = Charge
