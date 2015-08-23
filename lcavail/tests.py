from django.test import TestCase
from django.core.exceptions import ValidationError
from adhocmodels.models import NostroAccount, LedgerAccount
from postentry.models import EntryContra
from .models import LcAvailed
from datetime import date
import nose.tools as nt
from model_mommy import mommy
from model_mommy.recipe import Recipe


class LCAvailmentTest(TestCase):

    # fixtures = (
    #     'entry_code.json',
    #     'entry_generating_transaction.json',
    #     'adhocmodels.json',)

    def setUp(self):
        pass
        # self.ledger = ''
        # self.nostro = NostroAccount.objects.get(pk=1)
        # self.memo_acct = LedgerAccount.objects.filter(
        #     number__contains='MCSH')[1]

    def test_lcavailed_post_save_without_lc_number_validation(self):
        """Test saving LcAvailed with lc_number validation switched off."""

        lc = mommy.prepare_recipe('lcavail.lcavailed')

        # calling save() on the LcAvailed instance will raise ValidationError
        # because the lc_number will not return True when we call
        # adhocmodels.models.ValidTransactionRef.is_valid_trxn_ref(
        #     lc_number)
        with nt.assert_raises(ValidationError):
            lc.save()

        # we assert that no LcAvailed object has been created because the
        # previous call raised ValidationError
        nt.eq_(LcAvailed.objects.count(), 0)

        # we set the dont_validate property for lc_number
        lc.dont_validate = {
            'lc_number': True,
        }

        # calling save( now will not raise ValidationError)
        lc.save()

        # we check that an LcAvailed object has indeed been created
        nt.eq_(LcAvailed.objects.count(), 1)

    @nt.nottest
    def test_method_negotiated_passes(self):
        """
        Test negotiated() method
        """
        # negotiated lc
        lc1 = LcAvailed(
            lc_number='ILCLITF140520006',
            nostro_acct=self.nostro,
            memo_acct=self.memo_acct,
            drawn_amt=100000,
            dr_cr='D',
            flex_swift='S'
        )
        self.assertTrue(lc1.negotiated())

        # non negotiated lc
        lc2 = LcAvailed(
            lc_number='ILCLITF140520006',
            nostro_acct=self.nostro,
            memo_acct=self.memo_acct,
            drawn_amt=100000,
            dr_cr='D',
            flex_swift='F'
        )
        self.assertFalse(lc2.negotiated())

    @nt.nottest
    def test_drawn_amount_negative_raises_error(self):
        """
        Test that supplying a negative value for drawn_amt raises
        ValidationError. I should remove this test in the future.
        """

        with self.assertRaises(ValidationError):
            LcAvailed.objects.create(
                lc_number='ILCLITF140520006',
                nostro_acct=self.nostro,
                memo_acct=self.memo_acct,
                drawn_amt=-100000,
                dr_cr='D',
                flex_swift='S')

    @nt.nottest
    def test_lc_avail_method_successful(self):
            """
            Test the avail() method and that when posted, entry contra
            updates avail_date.
            """

            lc = LcAvailed.objects.create(
                lc_number='ILCLITF140520006',
                nostro_acct=self.nostro,
                memo_acct=self.memo_acct,
                drawn_amt=100000,
                dr_cr='D',
                flex_swift='S'
            )

            lc.avail()

            contra = EntryContra.objects.get(pk=1)
            self.assertEqual(contra.content_object, lc)

            today = date.today()
            contra.date_posted = today
            contra.save()
            self.assertEqual(LcAvailed.objects.get(pk=1).avail_date, today)

    @nt.nottest
    def test_you_cant_avail_if_already_availed(self):
        """Test that if this lc has already being availed, then you can not
        avail it. This means calling lc.avail() will return False."""

        lc = LcAvailed.objects.create(
            lc_number='ILCLITF140520006',
            nostro_acct=self.nostro,
            memo_acct=self.memo_acct,
            drawn_amt=100000,
            dr_cr='D',
            flex_swift='S'
        )
        # availing the first time should return True
        availed = lc.avail()
        self.assertTrue(availed)

        # but availing a second time should return False
        availed = lc.avail()
        self.assertFalse(availed)

    @nt.nottest
    def test_that_correct_narration_and_post_acct_is_set(self):
        """
        Test that calling set_narration_and_entry_code() correctly sets the
        narration.
        """

        lc = LcAvailed(
            lc_number='ILCLITF140520006',
            nostro_acct=self.nostro,
            memo_acct=self.memo_acct,
            drawn_amt=100000,
            dr_cr='D',
            flex_swift='S'
        )

        # debit entry in swift
        narration, entry_code, dr_acct, cr_acct = \
            lc.set_narration_and_entry_code()
        self.assertEqual(narration, 'ILCLITF140520006 AVAILED')
        self.assertEqual(dr_acct, lc.memo_acct)
        self.assertEqual(cr_acct, lc.ledger)

        # credit entry in swift
        lc.dr_cr = 'C'
        lc.flex_swift = 'S'
        narration, entry_code, dr_acct, cr_acct = \
            lc.set_narration_and_entry_code()
        self.assertEqual(narration, 'CVR FOR ILCLITF140520006')
        self.assertEqual(dr_acct, lc.ledger)
        self.assertEqual(cr_acct, lc.memo_acct)

        # dedit entry in flexcube
        lc.dr_cr = 'D'
        lc.flex_swift = 'F'
        narration, entry_code, dr_acct, cr_acct = \
            lc.set_narration_and_entry_code()
        self.assertEqual(
            narration, 'ILCLITF140520006 FUND EARLIER MOVED AND ENTRY PASSED')
        self.assertEqual(cr_acct, lc.ledger)
        self.assertEqual(dr_acct, lc.memo_acct)

        # credit entry in flexcube
        lc.dr_cr = 'C'
        lc.flex_swift = 'F'
        narration, entry_code, dr_acct, cr_acct = \
            lc.set_narration_and_entry_code()
        self.assertEqual(narration, 'ILCLITF140520006 AVAILED EARLIER')
        self.assertEqual(dr_acct, lc.ledger)
        self.assertEqual(cr_acct, lc.memo_acct)
