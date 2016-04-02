import factory
from factory import fuzzy
from core_recons.models import AttachmentFile, Attachment


class AttachmentFileFactory(factory.DjangoModelFactory):
    class Meta:
        model = AttachmentFile


class AttachmentFactory(factory.DjangoModelFactory):
    files = factory.SubFactory(AttachmentFileFactory)
    title = fuzzy.FuzzyText(length=10)

    class Meta:
        model = Attachment
