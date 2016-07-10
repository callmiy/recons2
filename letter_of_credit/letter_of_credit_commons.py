class BidRequestStatus:
    def __init__(self):
        pass

    CASH_BACKED = 0
    MATURED_OBLIGATION = 1
    LIQUIDITY_FUNDING = 2
    STATUSES = (
        (CASH_BACKED, 'CASH BACKED'),
        (MATURED_OBLIGATION, 'MATURED OBLIGATION'),
        (LIQUIDITY_FUNDING, 'LIQUIDITY FUNDING'),
    )
