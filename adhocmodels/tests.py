from unittest import SkipTest
from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import (
    RelationshipManager,
    Customer,
    Branch,
    AccountNumber)


class CustomerModelTest(TestCase):
    fixtures = ('test-adhocmodels.json',)

    def setUp(self):
        self.rm = RelationshipManager.objects.get(pk=1)
        self.rm2 = RelationshipManager.objects.get(pk=2)
        self.br = Branch.objects.get(pk=1)
        super(CustomerModelTest, self).setUp()

    def tearDown(self):
        delattr(self, 'rm')
        delattr(self, 'rm2')
        delattr(self, 'br')
        super(CustomerModelTest, self).tearDown()

    def test_can_create_customer_with_minimal_data(self):
        """
        tests that we can create a customer with the minimum
        required data i.e all fields where null != False
        """
        cust = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        self.assertEqual(Customer.objects.all().count(), 1)
        self.assertEqual(cust.name, 'Middle Point Ltd'.upper())
        self.assertEqual(cust.rel_manager, self.rm)

    # @SkipTest
    def test_can_create_parent_and_subsidiary_companies(self):
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub = Customer.objects.create(
            name='Inland Transaction',
            parent=parent)

        self.assertEqual(Customer.objects.all().count(), 2)
        self.assertEqual(sub.parent, parent)
        self.assertEqual(parent.subsidiaries.all()[0], sub)

    def test_calling_is_parent_on_a_customer(self):
        """
        tests that when we call isparent on a customer that has
        been properly set up as parent company, we are return True
        """
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub = Customer.objects.create(
            name='Inland Transaction',
            parent=parent)

        parent1 = Customer.objects.create(
            name='Middle Point Ltd 1',
            rel_manager=self.rm)

        self.assertTrue(parent.isparent)
        self.assertFalse(sub.isparent)
        self.assertFalse(parent1.isparent)

    def test_calling_issubsidiary_on_a_customer(self):
        """
        tests that issubsidiary only returns True for a
        Customer properly set up as a subsidiary
        """
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub1 = Customer.objects.create(
            name='Inland Transaction',
            parent=parent)

        sub2 = Customer.objects.create(
            name='Inland Transaction')

        self.assertTrue(sub1.issubsidiary)
        self.assertFalse(sub2.issubsidiary)

    # @SkipTest
    def test_that_parent_company_must_set_an_account_number(self):
        """
        Tests that if a customer is designated as a parent, then it
        have at least one account number
        """
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub1 = Customer.objects.create(
            name='Inland Transaction 1',
            parent=parent)

        self.assertTrue(parent.isparent)
        self.assertTrue(sub1.issubsidiary)
        self.assertEqual(len(parent.acct_numbers), 1)

        with self.assertRaises(ValidationError):
            parent = Customer.objects.create(
                name='Middle Point Ltd 1',
                rel_manager=self.rm)

            Customer.objects.create(
                name='Inland Transaction 2',
                parent=parent)

    # @SkipTest
    def test_can_get_acct_numbers_when_none_is_set_on_subsidiary(self):
        """
        tests that if we set account number on a subsidiary, then
        self.acct_numbs returns the accounts for that subsidiary
        else returns account numbers of its parent company
        """
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        acct_numb1 = AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub1 = Customer.objects.create(
            name='Inland Transaction 1',
            parent=parent)

        sub2 = Customer.objects.create(
            name='Inland Transaction 2',
            parent=parent)

        sub3 = Customer.objects.create(
            name='Inland Transaction 3')

        acct_numb2 = AccountNumber.objects.create(
            nuban='1234567891',
            branch=self.br,
            owner=sub2)

        self.assertTrue(parent.acct_numbs.all()[0] == parent.acct_numbers[0])
        self.assertTrue(acct_numb1 in sub1.acct_numbers)
        self.assertTrue(acct_numb2 in sub2.acct_numbers)
        self.assertFalse(acct_numb2 in parent.acct_numbs.all())
        self.assertTrue(sub1.acct_numbers[0] == parent.acct_numbs.all()[0])
        self.assertTrue(bool(sub3.acct_numbers) is False)
        self.assertEqual(len(sub3.acct_numbers), 0)

    def test_a_subsidiary_with_no_rel_manager_gets_one_from_parent(self):
        parent = Customer.objects.create(
            name='Middle Point Ltd',
            rel_manager=self.rm)

        AccountNumber.objects.create(
            nuban='1234567890',
            branch=self.br,
            owner=parent)

        sub1 = Customer.objects.create(
            name='Inland Transaction 1',
            parent=parent)

        sub2 = Customer.objects.create(
            name='Inland Transaction 2',
            parent=parent,
            rel_manager=self.rm2)

        self.assertEqual(parent.rm, self.rm)
        self.assertEqual(sub1.rm, self.rm)
        self.assertEqual(sub1.rm, parent.rel_manager)
        self.assertEqual(sub2.rm, self.rm2)
