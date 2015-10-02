import factory
from adhocmodels.models import Branch, AccountNumber, Customer

CUSTOMER_DATA = (
    #       0           1                   2           3           4
    # customer name, 'customer ID', account number, branch code, branch name
    ('JOF NIG LTD', '000208482', '0000801815', '682', 'STALLION PLAZA HEAD OFFICE',),
    ('CUTIX PLC', '000181365', '0026226180', '556', 'NNEWI',),
    ('MIDDLE POINT NIG LTD', '000502177', '0010626815', '096', 'TRADE FAIR MAIN',),
    ('PRIMA CORPORATION LIMITED', '005633394', '0040795361', '461', 'AJOSE ADEOGUN',),
    ('MDV INDUSTRIES LIMITED', '005643512', '0040884487', '461', 'AJOSE ADEOGUN',),
    # customer name, 'customer ID', account number, branch code, branch name
)


class BranchFactory(factory.DjangoModelFactory):
    code = factory.Iterator([data[3] for data in CUSTOMER_DATA])
    name = factory.Iterator([data[4] for data in CUSTOMER_DATA])

    class Meta:
        database = 'test'
        model = Branch


class CustomerFactory(factory.DjangoModelFactory):
    parent = factory.SubFactory('adhocmodels.factories.CustomerFactory')
    name = factory.Iterator([data[0] for data in CUSTOMER_DATA])

    class Meta:
        database = 'test'
        model = Customer


class AccountFactory(factory.DjangoModelFactory):
    branch = factory.Iterator(Branch.objects.all())
    owner = factory.Iterator(Customer.objects.all())
    nuban = factory.Iterator([data[2] for data in CUSTOMER_DATA])

    class Meta:
        database = 'test'
        model = AccountNumber
