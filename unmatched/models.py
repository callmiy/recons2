from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import pre_save
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.core.urlresolvers import reverse
from adhocmodels.models import NostroAccount, Customer, LedgerAccount
from postentry.models import EntryGeneratingTransaction

def get_model_name(obj):
    return '%s: %s' % (obj.__class__.__name__, str(obj))


STMT_LG_CHOICES = [('STMT', 'STATEMENT'), ('LG', 'LEDGER')]
SWIFT_OR_FLEX_CHOICES = [('S', 'SWIFT'), ('F', 'FLEXCUBE')]
DR_CR_CHOICES = [('D', 'DR'), ('C', 'CR')]


class UnmatchedRecons(models.Model):
    valdate = models.DateField('Value Date')
    entry_seq = models.CharField(
        'Entry Sequence No.', max_length=16, blank=True, null=True)
    amount = models.DecimalField('Dr/Cr', max_digits=16, decimal_places=2)
    lc_number = models.CharField(
        'LC Number', max_length=50, null=True, blank=True)
    external_ref = models.CharField(
        'External Reference', max_length=50, null=True, blank=True)
    stmt_or_lg = models.CharField(
        'Stmt or Ledger', choices=STMT_LG_CHOICES, max_length=4)
    acct_numb = models.ForeignKey(
        NostroAccount, db_column='acct_numb', verbose_name="Nostro")
    trnx_type = models.ForeignKey(
        EntryGeneratingTransaction, db_column='trnx_type', null=True,
        blank=True)
    date_first_uploaded = models.DateField(
        'Date First Uploaded', auto_now_add=True)
    date_upload_processed = models.DateField(
        'Date Upload Processed', blank=True, null=True)
    date_finally_processed = models.DateField(
        'Date Finally Processed', blank=True, null=True)
    show = models.BooleanField(default=True)
    customer = models.ForeignKey(Customer, blank=True, null=True)
    comment = models.TextField('Investigation Comment', null=True, blank=True)
    swift = models.TextField('Swift Message', null=True, blank=True)
    clarec_details = models.CharField(
        'Clarec Details', max_length=2000, null=True, blank=True)

    def save(self, *args, **kwargs):
        self.lc_number = self.lc_number.upper() if self.lc_number else ''

        if self.external_ref:
            self.external_ref = self.external_ref.upper()
        else:
            self.external_ref = ''

        super(UnmatchedRecons, self).save(*args, **kwargs)

    def is_dr(self):
        return self.amount < 0

    def is_cr(self):
        return self.amount > 0

    def abs_amount(self):
        return '{:,.2f}'.format(abs(self.amount))
    abs_amount.short_description = 'Value'

    def is_stmt(self):
        return self.stmt_or_lg == 'STMT'

    def currency(self):
        return self.acct_numb.ccy.code

    def __unicode__(self):
        return 'id: %d | flexID: %s' % (self.id, self.entry_seq,)

    class Meta:
        db_table = 'unmatched_recons'
        verbose_name = 'Unmatched Recons Record'
        verbose_name_plural = 'Unmatched Recons Records'


class UnmatchedClarec(models.Model):
    content_type = models.ForeignKey(ContentType, null=True, editable=False)
    object_id = models.PositiveIntegerField(null=True, editable=False)
    clirec_obj = generic.GenericForeignKey('content_type', 'object_id')
    post_date = models.DateField("Post Date")
    valdate = models.DateField("Value Date")
    details = models.CharField("Details", max_length=1000)
    amount = models.DecimalField("Amount", decimal_places=2, max_digits=20)
    lc_number = models.CharField(
        'LC Number', max_length=50, null=True, blank=True)
    nostro = models.ForeignKey(NostroAccount, verbose_name="Nostro")
    swift_flex = models.CharField(
        'Swift or Flex', choices=SWIFT_OR_FLEX_CHOICES, max_length=4)
    dr_cr = models.CharField('Dr/Cr', max_length=1, choices=DR_CR_CHOICES)
    show = models.BooleanField(default=True)
    date_first_uploaded = models.DateField(
        'Date First Uploaded', auto_now_add=True)
    comment = models.TextField('Investigation Comment', null=True, blank=True)
    date_upload_processed = models.DateField(
        'Date Upload Processed', blank=True, null=True)

    class Meta:
        db_table = 'clirec'
        verbose_name = 'Clirec'
        verbose_name_plural = 'Clirec'
        unique_together = (
            'post_date', 'valdate', 'details', 'amount',
            'nostro', 'swift_flex', 'dr_cr')

    def save(self, *args, **kwargs):
        self.details = self.details.strip(' \n\r\t')

        super(UnmatchedClarec, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.details

    def amount_fmt(self):
        return "{:,.2f}".format(self.amount)

    def currency(self):
        return self.nostro.ccy.code

    def get_url(self):
        return reverse('unmatched-clarec', kwargs={'pk': self.pk})


class TakenToMemo(models.Model):
    date = models.DateField('Date Added')
    amount = models.DecimalField('Amount', max_digits=12, decimal_places=2)
    contra_acct = models.ForeignKey(
        NostroAccount,
        verbose_name='Contra Account',
        related_name='taken2memo_contras')
    acct = models.ForeignKey(
        LedgerAccount,
        limit_choices_to={'is_default_memo': True},
        verbose_name='Account',
        related_name='taken2memos')
    clirecs = models.ManyToManyField(UnmatchedClarec)

    @classmethod
    def pre_save_validate(cls, sender, **kwargs):
        self = kwargs['instance']
        if self.contra_acct.ccy != self.acct.ccy:
            raise ValidationError("Account and Contra Account must have the same currency")

    class Meta:
        db_table = 'taken2memo'
        verbose_name = 'Taken To Memo'
        verbose_name_plural = 'Taken To Memo'

pre_save.connect(
    TakenToMemo.pre_save_validate,
    sender=TakenToMemo,
    dispatch_uid='y823gyde(U*(*54/554&TGB'
)
