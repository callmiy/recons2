import factory
from factory import fuzzy
from adhocmodels.models import Branch, AccountNumber, Customer
from core_recons.utilities import digits_char


class BranchFactory(factory.DjangoModelFactory):
    code = fuzzy.FuzzyText(length=9, chars=digits_char)
    name = factory.Sequence(lambda n: 'branch-{seq}'.format(seq=n))

    class Meta:
        model = Branch


class CustomerFactory(factory.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'customer-{seq}'.format(seq=n))

    class Meta:
        model = Customer


class AccountFactory(factory.DjangoModelFactory):
    branch = factory.Iterator(Branch.objects.all())
    owner = factory.Iterator(Customer.objects.all())
    nuban = fuzzy.FuzzyText(length=10, chars=digits_char)
    acct_id = fuzzy.FuzzyText(length=9, chars=digits_char)

    class Meta:
        model = AccountNumber
