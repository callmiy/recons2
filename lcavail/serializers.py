from rest_framework.serializers import ModelSerializer
from .models import LCCoverMovement


class LCCoverMovementSerializer(ModelSerializer):

    class Meta:
        model = LCCoverMovement
