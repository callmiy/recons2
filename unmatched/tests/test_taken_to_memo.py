from django.core.exceptions import ValidationError
from model_mommy import mommy
from rest_framework.test import APITestCase
import nose.tools as nt

__author__ = 'aademiju'


class TakenToMemoTest(APITestCase):

    def test_taken_to_memo_ccys_differ(self):
        contra_acct_model = mommy.make_recipe('adhocmodels.nostro_model_usd')
        acct_model = mommy.make_recipe('adhocmodels.ledger_acct_eur')

        with nt.assert_raises(ValidationError):
            # should raise validationerror because currencies are different
            mommy.make('TakenToMemo', contra_acct=contra_acct_model, acct=acct_model)
