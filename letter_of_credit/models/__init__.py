from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import pre_save
from django.db.utils import IntegrityError
from adhocmodels.models import Customer, Currency, Branch
import re


class LetterOfCredit(models.Model):
    lc_ref = models.CharField('LC Reference', max_length=16, null=True)
    applicant = models.ForeignKey(Customer)
    mf = models.CharField('Form M Number', max_length=13, null=True)
    ti_mf = models.CharField('TI Number for Form M', max_length=12, null=True)
    ccy = models.ForeignKey(Currency, verbose_name='Currency')
    amount = models.DecimalField('Amount', max_digits=14, decimal_places=2)
    bid_date = models.DateField('Bid Date', null=True)
    date_started = models.DateField('Date Started', auto_now_add=True)
    date_released = models.DateField('Date Released', null=True)

    class Meta:
        db_table = 'letter_of_credit'

    @classmethod
    def pre_save_action(cls, sender, instance=None, **kwargs):
        LETTER_OF_CREDIT_RE = re.compile(r'^ILCL[A-Z]{3}\d{9}$', re.IGNORECASE)
        MF_RE = re.compile(r'^MF\d{11}$', re.IGNORECASE)

        if instance.lc_ref is not None:
            lc_ref = str(instance.lc_ref).strip().upper()
            existing_with_same_ref = LetterOfCredit.objects.filter(lc_ref=lc_ref)
            if instance.pk:
                existing_with_same_ref = existing_with_same_ref.exclude(pk=instance.pk)
            if existing_with_same_ref.exists():
                raise IntegrityError('LC Reference is not unique')
            if not LETTER_OF_CREDIT_RE.match(lc_ref):
                raise ValidationError('Wrong LC Reference Format')
            instance.lc_ref = lc_ref

        if instance.mf is not None:
            mf = str(instance.mf).strip().upper()
            existing_with_same_ref = LetterOfCredit.objects.filter(mf=mf)
            if instance.pk:
                existing_with_same_ref = existing_with_same_ref.exclude(pk=instance.pk)
            if existing_with_same_ref.exists():
                raise IntegrityError('Form M number is not unique')
            if not MF_RE.match(mf):
                raise ValidationError('Wrong From M Number Format')
            instance.mf = mf

    def __unicode__(self):
        return '%s | %s | %s' % (self.applicant.name, self.mf, '{:,.2f}'.format(self.amount))

    def applicant_data(self):
        return self.applicant

    def ccy_obj(self):
        return self.ccy


pre_save.connect(
    LetterOfCredit.pre_save_action,
    sender=LetterOfCredit,
    dispatch_uid='1409845907.2227428jcijg6r$#@Wk')


class LcStatus(models.Model):
    text = models.CharField('Status text', max_length=256, )
    lc = models.ForeignKey(LetterOfCredit, verbose_name='Owner LC', related_name='statuses')
    created_at = models.DateTimeField('Creation Time', auto_now_add=True)

    class Meta:
        db_table = 'lc_status'

    @classmethod
    def pre_save_action(cls, sender, instance=None, **kwargs):
        text = instance.text
        instance.text = text.upper().strip()


pre_save.connect(
    LcStatus.pre_save_action,
    sender=LcStatus,
    dispatch_uid='bhv1409846567.90687&EHIJG^644+78//4'
)

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
    ccy = models.CharField(max_length=3, null=True, blank=True, editable=False)
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

    @classmethod
    def get_statistics(cls, qs):
        """Given a queryset, get the volume and value of all lcees."""
        vol_usd = 0
        usd_ngn_rate = Currency.objects.get(code='USD').rate_ngn
        for lc in qs:
            ccy = lc.ccy_obj
            vol_usd += float(lc.lc_amt_org_ccy) * ccy.rate_usd_by_ccy()
        return [qs.count(), vol_usd,
                vol_usd * float(usd_ngn_rate), usd_ngn_rate]
