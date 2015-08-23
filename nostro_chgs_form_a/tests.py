from unittest import TestCase
from mock import create_autospec, patch
from .models import NostroChgsFormA
from datetime import date


class NostroChgsFormATest(TestCase):

    @patch('adhocmodels.models.NostroAccount')
    def setUp(self, mocked_nostro):
        pass
        # self.mocked_nostro_chg = create_autospec(NostroChgsFormA)
        # self.mocked_nostro_chg.pk = 5
        # self.mocked_nostro_chg.completion_date = date(2014, 6, 10)
        # self.mocked_nostro_chg = NostroChgsFormA(
        #     amount=200,
        #     acct=mocked_nostro,
        #     approved_by='kanmii'
        # )

    def test_swift_suffix(self):
        pass
        # self.assertEqual(
        #     NostroChgsFormA.swift_suffix(self.mocked_nostro_chg),
        #     '00000005')

    # def test_set_swift_ref(self):
    #     self.assertEqual(
    #         NostroChgsFormA.set_swift_ref(self.mocked_nostro_chg),
    #         '2014061000000005'
    #     )
