from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db import models
from django.db.models.signals import pre_save
from adhocmodels.models import Customer, Currency
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
        app_label = 'letter_of_credit'
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

    @classmethod
    def released(cls, qs, released_only):
        if not released_only:
            return qs

        if released_only == 'True':
            return qs.filter(date_released__isnull=False)

        return qs.filter(date_released__isnull=True)


pre_save.connect(
    LetterOfCredit.pre_save_action,
    sender=LetterOfCredit,
    dispatch_uid='1409845907.2227428jcijg6r$#@Wk')


class LcStatus(models.Model):
    text = models.CharField('Status text', max_length=256, )
    lc = models.ForeignKey(LetterOfCredit, verbose_name='Owner LC', related_name='statuses')
    created_at = models.DateTimeField('Creation Time', auto_now_add=True)

    class Meta:
        app_label = 'letter_of_credit'
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
