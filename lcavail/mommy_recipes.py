from model_mommy.recipe import Recipe
from lcavail.models import LcAvailed

lcavailed = Recipe(
    LcAvailed,
    lc_number='ILCLITF140520006',
    nostro_acct__id=1,
    memo_acct__id=1,
)
