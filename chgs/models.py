from django.db import models
from adhocmodels.models import Currency, OverseasBank, Customer, NostroAccount
from unmatched.models import UnmatchedRecons


class Charge(models.Model):
    ccy = models.ForeignKey(Currency, db_column='ccy', verbose_name='Currency')
    amount = models.DecimalField("Amount", max_digits=9, decimal_places=2)
    overseas_ref = models.CharField(
        "Overseas Reference", max_length=16, null=True, blank=True)
    customer = models.ForeignKey(Customer, verbose_name="Customer Name", db_column='customer')
    unmatched = models.ForeignKey(
        UnmatchedRecons, null=True, blank=True, related_name='unmatched_chgs', editable=False)
    date_processed = models.DateField('Processing Date', auto_now_add=True)

    # if our acct wasnt debited but instead we were advised by swift msg to pay
    # chg, 'val_date_dr' will be null while "val_date_adv" wont be null

    #date our account was debited
    val_date_dr = models.DateField("Val Date of Dr", null=True, blank=True)

    #date requesting bank advised us of charge
    val_date_adv = models.DateField("Date Advd", null=True, blank=True)

    # The bank that is asking us for the chg. Most of the time, ds will be the
    # advising bank and the bank that debited our acct.
    # Then val_date_dr != None and val_date_adv is None. But where val_date_adv
    # is not None, it may mean we dont have c/a with req_bank
    # (e.g Bank of Beirut as at 10-sep-2013) or some banks like standard
    # chartered bank just like to stress us (lol).
    req_bank = models.ForeignKey(OverseasBank, db_column='req_bank', verbose_name='Requesting Bank')

    #overseas account to be credited
    cr_acct = models.ForeignKey(
        NostroAccount,
        blank=True,
        null=True,
        db_column='cr_acct',
        verbose_name='Acct. to credit')

    tkt_req_date = models.DateField("Ticket Req. Date", null=True, blank=True)
    tkt_mvd_date = models.DateField("Ticket Moved Date", null=True, blank=True)

    #text of swift msg used to advise charge
    swift_txt = models.TextField("Swift Message", blank=True, null=True)
    lc_number = models.CharField("LC Number", max_length=16)
    entry_seq = models.CharField(
        "Flex ID", max_length=16, blank=True, null=True, editable=False)
    clarec_details = models.CharField(
        'Clarec Details', max_length=1000, blank=True, null=True)

    clirec_details = models.CharField(
        'Clirec Details', max_length=1000, blank=True, null=True)

    def save(self, *args, **kw):
        self.lc_number = self.lc_number.upper()

        if self.clirec_details:
            self.clirec_details = self.clirec_details.strip()

        super(Charge, self).save(*args, **kw)

    def get_cr_acct(self):
        cr_acct = ''
        if self.cr_acct:
            cr_acct = self.cr_acct.number
        return cr_acct

    def display_req_bank(self):
        return self.req_bank.swift_bic
    display_req_bank.short_description = 'Bank'

    def display_clirec_details(self):
        if self.clirec_details:
            return self.clirec_details[:20]
        else:
            return ''
    display_clirec_details.short_description = 'Clirec Details'

    def chg_notification_date(self):
        return self.val_date_dr if self.val_date_dr else self.val_date_adv
    chg_notification_date.short_description = 'Date chg notified'

    def currency(self):
        return self.ccy.code

    def amountformated(self):
        return "{:,.2f}".format(self.amount)
    amountformated.short_description = "Amount"

    def is_zakhem(self):
        return 'zakhem' in self.customer.name.lower()

    def customer_acct_numb(self):
        return self.customer.acct_numbers[0].nuban

    def customer_acct_id(self):
        return self.customer.acct_numbers[0].acct_id

    def customer_brn_name(self):
        return self.customer.acct_numbers[0].branch.name

    def __unicode__(self):
        return "LC Number: %s | Charge Amount: %s %s" % (
            self.lc_number, self.ccy.code, self.amountformated())

    class Meta:
        ordering = ('val_date_dr', '-id',)
        db_table = 'chg'
