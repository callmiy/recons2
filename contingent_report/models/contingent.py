from django.db import models
from django.db.models import Sum
from contingent_report.models.ti_flex_recons import TIFlexRecons
from letter_of_credit.models import LCRegister
from datetime import timedelta


class LCClass(models.Model):
    prod_code = models.CharField('Product Code', max_length=4, unique=True)
    desc = models.CharField('Description', max_length=100)

    class Meta:
        db_table = "lc_class"
        verbose_name = 'LC Class'
        verbose_name_plural = 'LC Classes'


class ContingentAccount(models.Model):
    gl_code = models.CharField('GL Acct. Number', max_length=50, unique=True)
    ccy = models.CharField('Currency', max_length=3)
    in_use = models.NullBooleanField('In Use', default=None)
    acct_class = models.CharField('Account Class', max_length=10, default='')

    def __unicode__(self):
        return self.gl_code

    def get_fx_balance(self, end_date):
        bal = self.entries.filter(booking_date__lte=end_date).aggregate(bal=Sum('fx_amt'))['bal']
        if bal:
            return float(bal)
        return 0

    def get_acctount_counterpart(self):
        if self.acct_class == 'ASSET':
            if self.gl_code.startswith('CA5'):
                return self.gl_code.replace('CA5', 'CL6', 1)
            else:
                return '6' + self.gl_code[1:]
        else:
            if self.gl_code.startswith('CL6'):
                return self.gl_code.replace('CL6', 'CA5', 1)
            else:
                return '5' + self.gl_code[1:]

    def ca_cl_diff(self, endt):

        return self.get_fx_balance(endt) + \
               ContingentAccount.objects.get(gl_code=self.get_acctount_counterpart()).get_fx_balance(endt)

    def is_ca_cl_balcd(self, endt):
        return self.ca_cl_diff(endt) == 0

    def get_ngn_bal(self, endt):
        bal = self.entries.filter(booking_date__lte=endt).aggregate(bal=Sum('ngn_amt'))['bal']

        if bal:
            return float(bal)
        return 0

    def get_fx_bal(self, endt):
        bal = self.entries.filter(booking_date__lte=endt).aggregate(bal=Sum('fx_amt'))['bal']
        if bal:
            return float(bal)
        return 0

    def get_ccy_rate(self, end_date):
        try:
            return round(self.get_ngn_bal(end_date) / self.get_fx_bal(end_date), 7)
        except ZeroDivisionError:
            return 0

    @classmethod
    def get_rate_for_accounts_in_ccy(cls, ccy, end_date, acct_class='ASSET'):
        """Computes the rate that will be used for all accounts within a certain currency

        :param ccy: int
        :param end_date: string|datetime.date
        :param acct_class: string
        :return: float
        """
        fx_balances = 0
        ngn_balances = 0

        for acct in cls.objects.filter(ccy=ccy, acct_class=acct_class):
            fx_balances += acct.get_fx_bal(end_date)
            ngn_balances += acct.get_ngn_bal(end_date)

        try:
            return round(ngn_balances / fx_balances, 7)
        except ZeroDivisionError:
            return 0

    class Meta:
        db_table = 'contingent_acct'
        ordering = ('ccy',)
        verbose_name = 'Contingent Account'
        verbose_name_plural = 'Contingent Accounts'


class ContingentReport(models.Model):
    flex_ref = models.CharField('Flexcube Ref', max_length=50)
    ti_ref = models.CharField('TI Ref', max_length=16, blank=True, null=True)
    flex_module = models.CharField('Flexcube Module', max_length=2)
    gl_code = models.CharField('GL Acct. Number', max_length=50)
    acct_numb = models.ForeignKey(
            ContingentAccount, related_name='entries', blank=True, null=True)
    customer_name = models.CharField(
            'Customer Name', max_length=200, blank=True, null=True)
    booking_date = models.DateField('Booking Date')
    liq_date = models.DateField('Liquidation Date')
    ccy = models.CharField('Currency', max_length=3)
    fx_amt = models.DecimalField('FX Amount', max_digits=100, decimal_places=2)
    ngn_amt = models.DecimalField(
            'NGN Amount', max_digits=100, decimal_places=2)
    parent = models.ForeignKey(
            'self', related_name='members', db_column='parent', null=True,
            blank=True)
    ispar = models.BooleanField('Is Parent', default=False)
    narration = models.CharField(
            'Narration', max_length=300, null=True, blank=True)

    def fx_amt_fmt(self):
        return '{:,.2f}'.format(self.fx_amt)

    fx_amt_fmt.short_description = 'FX Amount'

    def ngn_amt_fmt(self):
        return '{:,.2f}'.format(self.ngn_amt)

    ngn_amt_fmt.short_description = 'NGN Amount'

    class Meta:
        db_table = 'contingent_report'
        ordering = ('-booking_date',)
        verbose_name = 'Contingent Report'
        verbose_name_plural = 'Contingent Reports'

    def insert_ti_ref(self):
        if not self.ti_ref and self.flex_module != 'RE':
            for ref in TIFlexRecons.objects.filter(flex_ref=self.flex_ref):
                self.ti_ref = ref.ti_ref
                return True
        return False

    def insert_customer_name(self):
        if not self.customer_name and self.flex_module == 'DE' and self.ti_ref:
            for lc in LCRegister.objects.filter(lc_number=self.ti_ref[:16]):
                self.customer_name = lc.applicant
                return True
        return False

    def get_customer_address(self):
        if self.customer_name:
            return LCRegister.objects.filter(
                    applicant=self.customer_name)[0].address

    @property
    def liquidation_date(self):
        return self.booking_date + timedelta(days=180)

    @property
    def bene(self):
        if self.customer_name:
            return LCRegister.objects.filter(
                    applicant=self.customer_name)[0].bene

    @property
    def lc_class(self):
        if self.customer_name:
            return LCRegister.objects.filter(
                    applicant=self.customer_name)[0].lc_class

    @property
    def is_cr(self):
        return self.fx_amt > 0


class OldContingentReport(models.Model):
    flex_ref = models.CharField('Flexcube Ref', max_length=50)
    lc_ref = models.CharField('LC Ref', max_length=16, blank=True, null=True)
    flex_module = models.CharField('Flexcube Module', max_length=2)
    gl_code = models.CharField('GL Acct. Number', max_length=50)
    customer_name = models.CharField(
            'Customer Name', max_length=200, blank=True, null=True)
    customer_id = models.CharField(
            'Customer ID', max_length=20, blank=True, null=True)
    booking_date = models.DateField('Booking Date')
    liq_date = models.DateField('Liquidation Date')
    ccy = models.CharField('Currency', max_length=3)
    fx_amt = models.DecimalField('FX Amount', max_digits=100, decimal_places=2)
    ngn_amt = models.DecimalField(
            'NGN Amount', max_digits=100, decimal_places=2)
    parent = models.ForeignKey(
            'self', related_name='members', db_column='parent', null=True,
            blank=True)
    ispar = models.BooleanField('Is Parent', default=False)
    narration = models.CharField(
            'Narration', max_length=300, null=True, blank=True)

    def fx_amt_fmt(self):
        return '{:,.2f}'.format(self.fx_amt)

    fx_amt_fmt.short_description = 'FX Amount'

    def ngn_amt_fmt(self):
        return '{:,.2f}'.format(self.ngn_amt)

    ngn_amt_fmt.short_description = 'NGN Amount'

    class Meta:
        db_table = 'old_contingent_report'
        ordering = ('-booking_date',)
        verbose_name = 'Old Contingent Report'
        verbose_name_plural = 'Old Contingent Reports'

    @property
    def liquidation_date(self):
        return self.booking_date + timedelta(days=180)

    @property
    def is_cr(self):
        return self.fx_amt > 0

    @classmethod
    def get_acct_fx_bal(cls, gl, endt):
        return float(cls.objects.filter(
                booking_date__lte=endt, gl_code=gl).aggregate(
                bal=Sum('fx_amt'))['bal'])

    @classmethod
    def get_acct_ngn_bal(cls, gl, endt):
        return float(cls.objects.filter(
                booking_date__lte=endt, gl_code=gl).aggregate(
                bal=Sum('ngn_amt'))['bal'])

    @classmethod
    def ca_cl_diff(cls, endt):
        return cls.get_acct_fx_bal('CA5001030', endt) + cls.get_acct_fx_bal(
                'CL6001030', endt)

    @classmethod
    def is_ca_cl_balcd(cls, endt):
        return cls.ca_cl_diff(endt) == 0

    @classmethod
    def get_global_ngn_bal(cls, endt, gl='CA5001030'):
        return float(cls.objects.filter(
                booking_date__lte=endt, gl_code=gl).aggregate(
                bal=Sum('ngn_amt'))['bal'])

    @classmethod
    def get_global_fx_bal(cls, endt, gl='CA5001030'):
        return float(cls.objects.filter(
                booking_date__lte=endt, gl_code=gl).aggregate(
                bal=Sum('fx_amt'))['bal'])

    @classmethod
    def get_ccy_rate(cls, endt):
        return round(
                cls.get_global_ngn_bal(endt) / cls.get_global_fx_bal(endt), 7)
