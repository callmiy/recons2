from django.core.urlresolvers import reverse
from django.db import models
from adhocmodels.models import Customer, Currency
from letter_of_credit.models import LCRegister


class FormMNotDeletedManager(models.Manager):
    def get_queryset(self):
        return super(FormMNotDeletedManager, self).get_queryset().filter(deleted_at__isNull=True)


class FormM(models.Model):
    number = models.CharField('Number', max_length=13, unique=True)
    applicant = models.ForeignKey(Customer, verbose_name='Applicant')
    currency = models.ForeignKey(Currency, verbose_name='Currency')
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    date_received = models.DateField('Date Received')
    lc = models.ForeignKey(LCRegister, null=True, blank=True, verbose_name='LC', related_name='form_m')
    goods_description = models.CharField('Goods Description', max_length=1000, blank=True, null=True)
    deleted_at = models.DateField('Date deleted', null=True, blank=True)

    objects = models.Manager()
    not_deleted = FormMNotDeletedManager()

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'form_m'
        verbose_name = 'Form M'
        verbose_name_plural = 'Form M'
        ordering = ('-date_received',)

    def __unicode__(self):
        return '[%s | %s%s | %s | %s]' % (
            self.number,
            self.currency.code,
            '{:,.2f}'.format(self.amount),
            self.applicant.name,
            self.goods_description and self.goods_description[:10] or ''
        )

    def save(self, *args, **kwargs):
        if self.goods_description:
            self.goods_description = self.goods_description.upper()

        if self.lc and self.lc.applicant_obj != self.applicant:
            self.lc.applicant_obj = self.applicant
            self.lc.save()
        super(FormM, self).save(*args, **kwargs)

    def applicant_data(self):
        return self.applicant

    def currency_data(self):
        return self.currency

    def get_url(self):
        return reverse('formm-detail', kwargs={'pk': self.pk})

    def attach_lc(self, lc_number=None, lc=None):
        if self.lc:
            return
        if lc is None and lc_number is None:
            raise ValueError('You must either specify "LCRegister" object or lc number')
        if lc:
            self.lc = lc
        elif lc_number:
            self.lc = LCRegister.objects.get(lc_number=lc_number)
        self.save()

    def applicant_name(self):
        return self.applicant.name

    def lc_number(self):
        return self.lc and self.lc.lc_number or None


class FormMCover(models.Model):
    ITF = 0
    STF = 1
    UNCONFIRMED = 2

    COVER_TYPES = (
        (ITF, 'ITF'),
        (STF, 'STF'),
        (UNCONFIRMED, 'UNCONFIRMED'),
    )

    mf = models.ForeignKey(FormM, verbose_name='Form M', related_name='covers')
    amount = models.DecimalField('Cover Amount', max_digits=20, decimal_places=2)
    cover_type = models.SmallIntegerField('Cover Type', choices=COVER_TYPES)
    received_at = models.DateField('Date Received', auto_now_add=True)

    class Meta:
        db_table = 'form_m_cover'
        app_label = 'letter_of_credit'

    def form_m_number(self):
        return self.mf.number

    def applicant(self):
        return self.mf.applicant.name

    def currency(self):
        return self.mf.currency.code

    def form_m_amount(self):
        return self.mf.amount

    def form_m_amount_formatted(self):
        return '{:,.2f}'.format(self.form_m_amount())

    form_m_amount_formatted.short_description = 'Form M Amount'

    def lc_number(self):
        lc = self.mf.lc
        return lc and lc.lc_number or None
