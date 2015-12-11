from django.contrib.contenttypes.models import ContentType

digits_char = [str(x) for x in range(10)]


def prepend_zeros(required, available):
    return ''.join('0' for c in range(required - available))


def admin_url(cls):
    return '/admin/%s/' % str(getattr(cls, '_meta')).replace('.', '/')


def get_content_type_id(instance):
    return ContentType.objects.get_for_model(instance).pk
