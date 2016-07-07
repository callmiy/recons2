import json
import os
import sys
import django
from collections import namedtuple
from string import lowercase

sys.path.insert(0, './..')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recons.settings')

django.setup()

from letter_of_credit.models.lc_bid_request import ConsolidatedLcBidRequest
from letter_of_credit.models import FormM, LcBidRequest


def get_bid_requests_str(number):
    bids = LcBidRequest.objects.filter(mf__number=number)

    if not bids.exists():
        return None

    bids_obj = {}

    for bid in bids:
        bids_obj[str(bid.id)] = float(bid.amount)

    return json.dumps(bids_obj)


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
        # 'bid_requests': get_bid_requests_str(mf_number),
        'status': ConsolidatedLcBidRequest.CASH_BACKED
    }

    consol = ConsolidatedLcBidRequest.objects.create(**obj)
    consol.bid_requests.add(*list(LcBidRequest.objects.filter(mf__number=mf_number)))
    print consol
