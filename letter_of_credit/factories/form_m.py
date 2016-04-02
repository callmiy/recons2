import datetime
import factory
from factory import fuzzy
from adhocmodels.factories import CustomerFactory, CurrencyFactory
from core_recons.utilities import digits_char
from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete, LcBidRequest


class LCIssueFactory(factory.DjangoModelFactory):
    text = factory.Sequence(lambda n: 'lc issue %d' % n)

    class Meta:
        model = LCIssue


class FormMFactory(factory.DjangoModelFactory):
    number = fuzzy.FuzzyText(length=9, prefix='MF20', chars=digits_char)
    applicant = factory.SubFactory(CustomerFactory)
    currency = factory.SubFactory(CurrencyFactory)
    amount = fuzzy.FuzzyDecimal(low=5000.00, high=1000000.99, precision=2)
    date_received = fuzzy.FuzzyDate(start_date=datetime.date(2015, 1, 1))
    goods_description = factory.Sequence(lambda n: 'form-m-goods-description-%s' % n)

    class Meta:
        model = FormM


class LCIssueConcreteFactory(factory.DjangoModelFactory):
    issue = factory.SubFactory(LCIssueFactory)
    mf = factory.SubFactory(FormMFactory)

    class Meta:
        model = LCIssueConcrete


class LcBidRequestFactory(factory.DjangoModelFactory):
    mf = factory.SubFactory(FormMFactory)
    amount = fuzzy.FuzzyDecimal(low=10, high=1000000.99, precision=2)

    class Meta:
        model = LcBidRequest
