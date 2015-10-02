from django.db import models, IntegrityError
from adhocmodels.models import Customer, Currency, NostroAccount
from unmatched.models import UnmatchedRecons


class SourceFx(models.Model):
    code = models.CharField('Code', max_length=100, unique=True)
    description = models.CharField(
        'Description', max_length=255, null=True, blank=True)

    def __unicode__(self):
        return self.code

    class Meta:
        db_table = 'source_fx'
        verbose_name = 'Source of FX'
        verbose_name_plural = 'Sorce of FX'


class UndrawnBal(models.Model):
    lc_number = models.CharField('LC Number', max_length=16)
    estb_amt_ccy = models.ForeignKey(Currency, related_name='estb_amt_ccy', verbose_name='Estb. Amount Currency')
    estb_amt = models.DecimalField(
        'Estab. Amount', max_digits=20, decimal_places=2)
    claim_amt_ccy = models.ForeignKey(
        Currency,
        related_name='claim_amt_ccy',
        verbose_name='Claim Amount Currency')
    claim_amt = models.DecimalField(
        'Claim Amount', max_digits=20, decimal_places=2)
    surplus_amt_ccy = models.ForeignKey(
        Currency,
        related_name='surplus_amt_ccy',
        verbose_name='Surplus Amount Currency')
    surplus_amt = models.DecimalField(
        'Surplus Amount', max_digits=20, decimal_places=2)
    customer = models.ForeignKey(
        Customer, related_name='cust_undrawn_bals')
    source_fund = models.ForeignKey(SourceFx)
    nostro = models.ForeignKey(
        NostroAccount, related_name='undrawn_nostros',)
    formm_numb = models.CharField(
        'Form M Number', max_length=21, null=True, blank=True)
    rate = models.DecimalField(
        'Rate', max_digits=14, decimal_places=7, null=True, blank=True)
    ticket_no = models.IntegerField('Ticket No.', null=True, blank=True)
    unmatched = models.ForeignKey(
        UnmatchedRecons, null=True, blank=True, editable=False,
        related_name='unmatched_undrawns')
    date_cust_paid = models.DateField('Day Cust. Paid', null=True, blank=True)

    class Meta:
        db_table = 'undrawn'
        verbose_name = 'Undrawn Balance'
        verbose_name_plural = 'Undrawn Balances'

    def __unicode__(self):
        return '{} {}{:,.2f}'.format(self.lc_number,
                                     self.surplus_amt_ccy.code,
                                     self.surplus_amt)

    def save(self, *args, **kwargs):
        if self.unmatched and UndrawnBal.objects.filter(
                unmatched=self.unmatched).exists():
            code = 'ERRORCODE=UNMATCHED_INTEGRITY_FAILED'
            raise IntegrityError(
                'Unmatched Record must be unique or None\n%s' % code)
        return super(UndrawnBal, self).save(*args, **kwargs)
