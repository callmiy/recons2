import factory
from factory import fuzzy
from adhocmodels.models import Currency


class CurrencyFactory(factory.DjangoModelFactory):
    code = fuzzy.FuzzyText(length=3)
    name = factory.Sequence(lambda n: 'CURRENCY-NAME-%s' % n)

    class Meta:
        model = Currency
