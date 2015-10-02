import factory
from adhocmodels.models import Branch, AccountNumber, Customer

customer_names = ['JOF NIG LTD', 'CUTIX PLC', 'MIDDLE POINT NIG LTD', 'PRIMA CORPORATION LIMITED',
                  'MDV INDUSTRIES LIMITED']
customer_id = ['000208482', '000181365', '000502177', '005633394', '005643512']
branch_codes = ['682', '556', '096', '461', ]
branch_names = ['STALLION PLAZA HEAD OFFICE', 'NNEWI', 'TRADE FAIR MAIN', 'AJOSE ADEOGUN', 'AJOSE ADEOGUN']
account_numbers = ['0000801815', '0026226180', '0010626815', '0040795361', '0040884487']


class BranchFactory(factory.DjangoModelFactory):
    code = factory.Iterator(branch_codes)
    name = factory.Iterator(branch_names)

    class Meta:
        model = Branch


class CustomerFactory(factory.DjangoModelFactory):
    parent = factory.SubFactory('adhocmodels.factories.CustomerFactory')
    name = factory.Iterator(customer_names)

    class Meta:
        model = Customer


class AccountFactory(factory.DjangoModelFactory):
    branch = factory.Iterator(Branch.objects.all())
    owner = factory.Iterator(Customer.objects.all())
    nuban = factory.Iterator(account_numbers)

    class Meta:
        model = AccountNumber
