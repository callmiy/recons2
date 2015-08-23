from django.test import TestCase
import nose.tools as nt

# Create your tests here.
from model_mommy import mommy
from letter_of_credit.models import LetterOfCredit


class LetterOfCreditTest(TestCase):

    def test_letter_of_credit_model_repr(self):
        appl = mommy.make('Customer', name='MIDDLE POINT NIG LTD')
        ccy = mommy.make('Currency', code='USD')
        lc = mommy.make('LetterOfCredit',
                        applicant=appl,
                        # ccy__id=1,
                        ccy=ccy,
                        mf='MF2014',
                        amount=200)
        lc.save()

        nt.eq_(lc.__unicode__(),
               '{"Form M": "MF2014", "applicant": "MIDDLE POINT NIG LTD"}')