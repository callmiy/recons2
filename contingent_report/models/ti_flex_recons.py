from django.db import models
from core_recons.csv_utilities import BA_RE, MF_RE
from letter_of_credit.models import LCRegister


class TIPostingStatusReport(models.Model):
    ref = models.CharField('TI Ref Number', max_length=20)
    posting_date = models.DateField('Posting Date')
    acct_number = models.CharField('Account Number', max_length=100)
    ccy = models.CharField('Currency', max_length=3)
    amount = models.DecimalField('Amount', max_digits=100, decimal_places=2)
    narration = models.CharField('Narration', max_length=200)
    applicant = models.CharField(
        'Applicant', max_length=200, null=True, blank=True)
    success = models.CharField('Success or Failure', max_length=7)
    mf = models.CharField("Form M Number", max_length=13, null=True, blank=True)
    ba = models.CharField('BA Number', max_length=16, null=True, blank=True)
    comment = models.TextField('Comment', null=True, blank=True)

    class Meta:
        db_table = 'ti_posting_status_report'
        ordering = ('-posting_date',)

    def __unicode__(self):
        return '%s | %s%s | %s' % (
            self.ref, self.ccy, self.amount_formatted(), self.acct_number)

    def save(self, *args, **kwargs):
        if not self.mf:
            self.mf = self.insert_mf()

        if not self.ba:
            self.ba = self.insert_ba()

        self.insert_applicant()

        super(TIPostingStatusReport, self).save(*args, **kwargs)

    def post_manually(self):
        if self.comment:
            self.comment = '%s\nSUCCESS' % self.comment
        else:
            self.comment = 'SUCCESS'

    def post_success(self):
        """Django admin utility."""
        return self.success == 'SUCCESS' or \
               self.commented() and 'SUCCESS' in self.comment

    post_success.short_description = 'POSTING SUCCEEDED'

    def commented(self):
        """Django admin utility."""
        return self.comment and True or False

    def insert_applicant(self):
        appl = LCRegister.objects.filter(lc_number=self.ref)
        if appl.exists():
            self.applicant = appl[0].applicant
            return True

        return False

    def insert_mf(self):
        mf = MF_RE.search(self.narration)
        return mf.group() if mf else ''

    def insert_ba(self):
        ba = BA_RE.search(self.narration)
        return ba.group() if ba else ''

    def amount_formatted(self):
        return '{:,.2f}'.format(self.amount, )

    def is_customer_acct(self):
        if self.acct_number and self.acct_number.isdigit() and len(self.acct_number) == 10:
            return self.acct_number
        return False

    def is_vat_acct(self):
        if self.acct_number:
            return self.acct_number.startswith('LI')
        return False

    def is_income_acct(self):
        if self.acct_number:
            return self.acct_number.startswith('IN')
        return False

    def is_pl_earning(self):
        """check if the postings is an earning into profit and loss."""
        if not self.acct_number or \
                not self.acct_number.startswith('IN') or \
                        self.amount < 0:
            return False

        for contra in TIPostingStatusReport.objects.filter(
                ref=self.ref, posting_date=self.posting_date,
                ccy=self.ccy, narration=self.narration):
            if contra.acct_number.isdigit():
                return True

        return False


class TIFlexRecons(models.Model):
    brn_code = models.CharField('Branch Code', max_length=3)
    brn_name = models.CharField('Branch Name', max_length=200)
    flex_ref = models.CharField('Flex Ref', max_length=16)
    ti_ref = models.CharField('TI Ref', max_length=20)
    acct_numb = models.CharField('Account Number', max_length=20)
    acct_name = models.CharField('Account Name', max_length=200)
    ccy = models.CharField('Currency', max_length=3)
    dr_cr = models.CharField('Dr/Cr', max_length=1)
    fcy_amt = models.DecimalField('Fcy Amount', max_digits=20, decimal_places=2)
    lcy_amt = models.DecimalField('Lcy Amount', max_digits=20, decimal_places=2)
    val_date = models.DateField('Value Date')
    narration = models.CharField('Narration', max_length=200)

    class Meta:
        db_table = 'ti_flex'
        ordering = ('-val_date',)
        verbose_name_plural = 'TI Flex Recons Date Prompt'
        verbose_name = 'TI Flex Recons Date Prompt'

    def fcy_fmt(self):
        return '{:,.2f}'.format(self.fcy_amt, )

    fcy_fmt.short_description = 'Fcy Amount'

    def lcy_fmt(self):
        return '{:,.2f}'.format(self.lcy_amt, )

    lcy_fmt.short_description = 'Lcy Amount'
