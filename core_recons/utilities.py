from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse

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
