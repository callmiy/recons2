import factory
from factory import fuzzy
from adhocmodels.models import Currency
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


class UserFactory(factory.DjangoModelFactory):
    password = make_password('password')

    class Meta:
        model = User


class CurrencyFactory(factory.DjangoModelFactory):
    code = fuzzy.FuzzyText(length=3)
    name = factory.Sequence(lambda n: 'CURRENCY-NAME-%s' % n)

    class Meta:
        model = Currency
