__author__ = 'maneptha'

from model_mommy.recipe import Recipe
from model_mommy import mommy
from adhocmodels.models import Currency, NostroAccount, LedgerAccount, Customer


ccy_usd_model = Recipe(Currency, code='USD')
ccy_eur_model = Recipe(Currency, code='EUR')

nostro_model_usd = Recipe(
    NostroAccount, ccy=ccy_usd_model
)

ledger_acct_eur = Recipe(
    LedgerAccount, ccy=ccy_eur_model
)

customer_middle_point = Recipe(
    Customer, name='MIDDLE POINT NIG LTD'
)
