from collections import namedtuple
from xlrd import colname
from xlwt import Workbook
from datetime import date
import re

wrow = lambda sh, row, vals: [sh.write(row, colx, val) for colx, val
                              in enumerate(vals)]

Cols = namedtuple("Cols", " ".join(colname(c).lower() for c in range(44)))
col = Cols(*range(44))

BA_RE = re.compile(r'(BA|CB)\d+', re.IGNORECASE)
MF_RE = re.compile(r'MF\d+', re.IGNORECASE)
LC_REF_RE = re.compile(r'(ILCL|026L)[A-Z]{3}\d+', re.IGNORECASE)

DATE_RE = re.compile(
        r'(?P<d>\d{1,2})[\s\\/-](?P<m>([a-z]{3}|\d{1,2}))[\s\\/-](?P<y>\d{2,4})',
        re.IGNORECASE
)


def parse_date(dtsring):
    DATE_RE = re.compile(r'(?P<d>\d{1,2})-(?P<m>\d{1,2})-(?P<y>\d{4})')
    dt_str = DATE_RE.match(dtsring.strip('\n\r '))

    if not dt_str:
        raise ValueError('Date format incorrect')

    return date(
            int(dt_str.group('y')),
            int(dt_str.group('m')),
            int(dt_str.group('d'))
    )


def parse_xl_date(xldate):
    pass


class UploadCSVParserUtility:
    def __init__(self):
        pass

    def normalize(self, val):
        """Just strip whitespace characters from val."""
        if not val:
            return val
        else:
            return val.strip(' \n\r\t')

    def normalize_ref(self, ref):
        if not ref:
            return ref

        for token in ('\n', '\r', ' ', '.'):
            ref = ref.replace(token, '')

        if BA_RE.match(ref) and ref[2:5] != '032':
            ref = ref[:2] + '032' + ref[2:]

        return ref.strip(' \n\r\t').upper()

    def normalize_date(self, val, date_format='dd-mm-yyyy'):
        mon_names = ('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
                     'sep', 'oct', 'nov', 'dec')

        m = DATE_RE.match(val)
        if m:
            day, mon_name, year = m.group('d'), m.group('m'), m.group('y')

            if mon_name.isalpha():
                return date(
                        int(year),
                        mon_names.index(mon_name.lower()) + 1,
                        int(day)
                )
            else:
                if date_format == 'mm-dd-yyyy':
                    return date(int(year), int(day), int(mon_name))
                return date(int(year), int(mon_name), int(day))
        else:
            raise ValueError('Not a valid date: %s' % val)

    def normalize_amount(self, amt):
        if amt:
            amt = amt.strip(' \n\r')
            if amt:
                return float(amt.replace(',', ''))
        return float(0)

    def normalize_acct_numb(self, acct_numb):
        EXPECTED_LEN = 10
        acct_numb = acct_numb.strip(' \n\r')
        # if acct_numb.isdigit() and len(acct_numb) < EXPECTED_LEN:
        #     zeros = ''.join('0' for c in range(EXPECTED_LEN - len(acct_numb)))
        #     return '%s%s' % (zeros, acct_numb,)
        return acct_numb


class GefuExcelMaker(object):
    """Writes gefu data to excel."""

    def __init__(self):
        self.wb = Workbook()

    def writerow(self, sheet, row, *row_vals):
        """function for writing a row of values to the output worksheet."""
        seq, dr_cr, acct_numb, brn_code, amt, rm_code, narration = row_vals

        trxn_type = 1 if dr_cr == 'D' else 3
        trxn_code = 1008 if dr_cr == 'D' else 1460
        datex = date.today().strftime('%d/%m/%Y')

        cell_data = (trxn_type, acct_numb, brn_code, trxn_code, datex, dr_cr,
                     datex, 100.00, amt, amt, 1.00, seq, rm_code, narration,
                     123, '', 'Addr1', 'addr2', 'addr3', 'city', 'ABEOKUTA',
                     'NIGERIA', 400001, 10, '', 0, 'N')
        [sheet.write(row, col, val) for col, val in enumerate(cell_data)]
