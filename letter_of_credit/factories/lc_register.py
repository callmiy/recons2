from factory import fuzzy
import factory
import datetime
from adhocmodels.factories import CustomerFactory, CurrencyFactory, BranchFactory
from adhocmodels.models import Currency
from core_recons.utilities import digits_char
from letter_of_credit.models import LCRegister


class FuzzyLcNumber(fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        choice = fuzzy._random.choice
        year_data = datetime.date(2015, 1, 1) + datetime.timedelta(days=choice(range(731)))

        return 'ILCL{product_code}{year_date}{sequence}'.format(
            product_code=choice(['CSH', 'STF', 'ITF', 'UNC', 'CDO']),
            year_date=year_data.strftime('%y%j'),
            sequence=choice(range(1000, 10000))
        )


class LCRegisterFactory(factory.DjangoModelFactory):
    lc_number = FuzzyLcNumber()
    mf = fuzzy.FuzzyText(length=9, prefix='MF20', chars=digits_char)
    estb_date = fuzzy.FuzzyDate(start_date=datetime.date(2015, 1, 1))
    expiry_date = fuzzy.FuzzyDate(start_date=datetime.date(2015, 1, 1))
    confirmation = factory.Iterator(('CONFIRM', 'WITHOUT', 'MAY ADD',))
    applicant = factory.Sequence(lambda n: 'customer-{seq}'.format(seq=n))
    ccy_obj = factory.Iterator(Currency.objects.all())
    lc_amt_org_ccy = fuzzy.FuzzyDecimal(low=5000, high=1000000.99, precision=2)
    sector = factory.Iterator(('CBG', 'COMMERCIAL',))

    class Meta:
        model = LCRegister
