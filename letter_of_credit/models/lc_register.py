from django.db import models
from adhocmodels.models import Customer, Currency, Branch


class LCRegister(models.Model):
    lc_number = models.CharField('LC Number', max_length=20)
    mf = models.CharField('Form M Number', max_length=20, null=True, blank=True)
    date_started = models.DateField('Date Started', auto_now_add=True)
    estb_date = models.DateField('Estab. Date')
    expiry_date = models.DateField('Expiry Date')
    confirmation = models.CharField('Confirmation', max_length=100, null=True, blank=True)
    lc_class = models.CharField('LC Classification', max_length=100, null=True, blank=True)
    applicant = models.CharField('Applicant', max_length=200)
    applicant_obj = models.ForeignKey(Customer, null=True, related_name='lc_register_obj', blank=True)
    address = models.CharField('Applicant Address', max_length=200, null=True, blank=True)
    bene = models.CharField('Beneficiary Name', max_length=200, null=True, blank=True)
    bene_country = models.CharField('Beneficiary Address', max_length=200, null=True, blank=True)
    advising_bank = models.CharField('Advising Bank', max_length=200, null=True, blank=True)
    ccy_obj = models.ForeignKey(Currency, related_name='lc_reg_ccy', verbose_name='Currency', )
    lc_amt_org_ccy = models.DecimalField('FX Amount', max_digits=100, decimal_places=2, )
    lc_amt_usd = models.DecimalField('LC Amount In USD', max_digits=100, decimal_places=2, null=True, blank=True)
    supply_country = models.CharField('Country of Supply', max_length=200, null=True, blank=True)
    port = models.CharField('Port of Discharge', max_length=200, null=True, blank=True)
    description = models.TextField('Goods Description', null=True, blank=True)
    ba = models.CharField('BA Number', max_length=20, null=True, blank=True)
    acct_numb = models.CharField('Account Number', max_length=13, null=True, blank=True)
    brn_code = models.CharField('Branch Code', max_length=3, null=True, blank=True)
    brn_name = models.CharField('Branch Name', max_length=200, null=True, blank=True)
    brn_obj = models.ForeignKey(Branch, null=True, blank=True)
    sector = models.CharField(
        'Sector',
        choices=(('CBG', 'CBG',), ('COMMERCIAL', 'COMMERCIAL',)),
        max_length=11,
        null=True,
        blank=True
    )

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'lc_register'
        ordering = ('-estb_date',)

    def __unicode__(self):
        return '%s | %s | %s | %s%s' % (
            self.lc_number, self.applicant, self.mf, self.ccy_obj.code, '{:,.2f}'.format(self.lc_amt_org_ccy))

    def applicant_data(self):
        return self.applicant_obj

    def ccy_data(self):
        return self.ccy_obj

    def update_acct_numb(self):
        if not self.acct_numb:
            for lc in LCRegister.objects.filter(applicant=self.applicant, acct_numb__isnull=False):
                acct_numb = lc.acct_numb
                if acct_numb:
                    self.acct_numb = acct_numb
                    self.save()
                    return True
        return False

    def issues(self):
        form_m = self.form_m.all()
        if form_m.exists():
            return form_m[0].form_m_issues.filter()
        return None
