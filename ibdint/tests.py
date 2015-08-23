from django.test import TestCase
from .models import IbdInt
from adhocmodels.models import NostroAccount, Customer
from postentry.models import EntryContra
from datetime import date, timedelta


class IbdIntTest(TestCase):

    fixtures = (
        'entry_code.json',
        'entry_generating_transaction.json',
        'adhocmodels',)

    def setUp(self):
        self.today = date.today()
        self.acct = NostroAccount.objects.get(pk=1)
        self.customer = Customer.objects.all()[0]

    def test_updating_contra_post_date_updates_ibdint_post_date(self):
        """
        Tests that when we update contra related to an ibdint as posted, the
        ibdint will be updated as posted too.
        """

        ibd = IbdInt.objects.create(
            valdate_in_ca=self.today,
            lc_number='ILCLITF140520369',
            acct=self.acct,
            customer=self.customer,
            amount=1000
        )

        ibd.write_posting()

        contra = EntryContra.objects.get(pk=1)
        contra.date_posted = self.today + timedelta(days=1)
        contra.save()

        self.assertEqual(
            IbdInt.objects.get(pk=1).valdate_in_pl, contra.date_posted)

    def test_you_can_post_only_once(self):
        """Tests that if we try to post twice, the second posting will return
        false, meaning it wasnt posted."""

        ibd = IbdInt.objects.create(
            valdate_in_ca=self.today,
            lc_number='ILCLITF140520369',
            acct=self.acct,
            customer=self.customer,
            amount=1000
        )

        posting = ibd.write_posting()
        self.assertTrue(posting)

        posting = ibd.write_posting()
        self.assertFalse(posting)
