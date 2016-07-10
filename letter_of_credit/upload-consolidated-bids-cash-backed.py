import json
import os
import sys
import django
from collections import namedtuple
from string import lowercase

from letter_of_credit.letter_of_credit_commons import BidRequestStatus

sys.path.insert(0, './..')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recons.settings')

django.setup()

from letter_of_credit.models.consolidated_lc_bid_request import ConsolidatedLcBidRequest
from letter_of_credit.models import FormM, LcBidRequest

cols = namedtuple('cols', list(lowercase))
col = cols(*range(0, len(lowercase)))

for line in open('./../../cash-backed.txt').readlines():
    line = line.strip().split('\t')
    mf_number = line[col.d].strip()
    mf = FormM.objects.get(number=mf_number)

    obj = {
        'requested_at': line[col.b].strip(),
        'mf': mf,
        'rate': line[col.e].strip(),
        'amount': line[col.j].strip().replace(',', ''),
        'initial_allocated_amount': line[col.l].strip().replace(',', ''),
        'goods_category': line[col.s].strip(),
        'status': BidRequestStatus.CASH_BACKED
    }

    print ConsolidatedLcBidRequest.objects.create(**obj)
