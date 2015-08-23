from django.test import TestCase
from postentry.models import EntryContra, Entry, EntryCode
from adhocmodels.models import LedgerAccount


class EntryAndContraTest(TestCase):

    fixtures = (
        'adhocmodels.json',
        'entry_code.json',)

    def setUp(self):
        self.ledger = LedgerAccount.objects.get(pk=1)
        self.code = EntryCode.objects.get(pk=1)
        narration = 'LC AVAILED'
        ref = '026LITF1302600001'
        self.entry = Entry.objects.create(amount=50)

        self.entries = (
            {'amount': 50,
             'account': self.ledger,
             'entry_code': self.code,
             'narration': narration,
             'ref': ref,
             'entry': self.entry},

            {'amount': -50,
             'account': self.ledger,
             'entry_code': self.code,
             'narration': narration,
             'ref': ref,
             'entry': self.entry}
        )

    def test_entry_contras_post_entry_method_with_minimal_data(self):
        """We test entrycontra with the minimum amount of attributes
        possible.
        """
        posted = EntryContra.post_entry(*self.entries)

        self.assertTrue(posted)
        self.assertEqual(EntryContra.objects.count(), 2)
        self.assertTrue(self.entry.contras_dr_equals_cr())

    def test_entry_contras_post_entry_method_with_generic_foreign_key(self):
        dr, cr = self.entries
        dr.update({'model': self.ledger})
        cr.update({'model': self.ledger})

        posted = EntryContra.post_entry(*self.entries)

        self.assertTrue(posted)
        self.assertEqual(EntryContra.objects.count(), 2)
        self.assertTrue(self.entry.contras_dr_equals_cr())
        self.assertEqual(
            EntryContra.objects.get(pk=1).content_object, self.ledger)
