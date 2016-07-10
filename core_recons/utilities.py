from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from collections import namedtuple
from string import lowercase

Cols = namedtuple('Cols', list(lowercase))
col = Cols(*range(1, len(lowercase) + 1))

digits_char = [str(x) for x in range(10)]


def prepend_zeros(required, available):
    return ''.join('0' for c in range(required - available))


def admin_url(cls):
    return '/admin/%s/' % str(getattr(cls, '_meta')).replace('.', '/')


def get_content_type(instance):
    return ContentType.objects.get_for_model(instance)


def get_content_type_id(instance):
    return get_content_type(instance).pk


def get_content_type_url(instance):
    return reverse('contenttype-detail', kwargs={'pk': get_content_type(instance).pk})


def get_generic_related_model_class_str(instance):
    return str(instance.object_instance._meta.model)


class DynamicFieldsSerializerMixin(object):
    """
    A serializer mixin that takes an additional `fields` argument that controls
    which fields should be displayed.
    Usage::
        class MySerializer(DynamicFieldsSerializerMixin, serializers.HyperlinkedModelSerializer):
            class Meta:
                model = MyModel
    """

    def __init__(self, *args, **kwargs):
        super(DynamicFieldsSerializerMixin, self).__init__(*args, **kwargs)

        if not self.context:
            return

        fields = self.context['request'].query_params.get('fields')
        if fields:
            fields = fields.split(',')
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
