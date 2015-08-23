from django.db import models
from django.db import IntegrityError
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.contenttypes.models import ContentType
from adhocmodels.models import (
    NostroAccount,
    LedgerAccount,
    ValidTransactionRef)
from postentry.models import EntryContra, EntryCode, EntryGeneratingTransaction
from unmatched.models import UnmatchedRecons


class LcAvailed(models.Model):
    lc_number = models.CharField("LC Number", max_length=16)
    date_negotiated = models.DateField("Date Negotiated", blank=True, null=True)
    nostro_acct = models.ForeignKey(NostroAccount, db_column='nostro_acct')
    memo_acct = models.ForeignKey(
        LedgerAccount, db_column='memo_acct', verbose_name='Memo Cash')
    avail_date = models.DateField("Date Availed", null=True, blank=True)
    date_processed = models.DateField("Date Processed", auto_now_add=True)
    drawn_amt = models.DecimalField(
        "Amount Drawn", max_digits=14, decimal_places=2)
    dr_cr = models.CharField(
        'Debit/Credit', choices=(('D', 'DR',), ('C', 'CR')), max_length=1)
    flex_swift = models.CharField(
        'Flex/Swift', choices=[('S', 'SWIFT'), ('F', 'FLEX')], max_length=1)

    # the following will eventually be cleaned up or cleaned out
    entry_seq = models.CharField(
        'Flexcube ID', max_length=16, blank=True, null=True, editable=False)
    unmatched = models.ForeignKey(
        UnmatchedRecons, null=True, blank=True, related_name='unmatched_lcees',
        editable=False)
    clarec_detail = models.CharField(
        'Clirec Detail', max_length=1000, null=True, blank=True)

    def __unicode__(self):
        return '[%s: %s%s]' % (self.lc_number, self.currency(), self.drawing())

    @classmethod
    def lc_availed_pre_save(cls, **kwargs):
        self = kwargs['instance']

        self.lc_number = self.lc_number.strip().upper()
        # ensure lc number is valid if we dont state otherwise
        dont_validate = getattr(self, 'dont_validate', None)
        if dont_validate and dont_validate.get('lc_number') is True:
            pass
        elif not ValidTransactionRef.is_valid_trxn_ref(self.lc_number):
            raise ValidationError('Invalid LC Number "%s"' % self.lc_number)

        # ensure drawn_amt is always positive
        if self.drawn_amt < 0:
            raise ValidationError(
                'Drawn Amount must be greater than zero, got: %d' %
                self.drawn_amt)

        if self.clarec_detail:
            self.clarec_detail = self.clarec_detail.strip()

        # super(LcAvailed, self).save(*args, **kwargs)

    def negotiated(self):
        return self.flex_swift == 'S' and self.dr_cr == 'D'

    def set_drawn_amount(self):
        pass

    def displayed_clarec_detail(self):
        if self.clarec_detail:
            return self.clarec_detail[:20]
        else:
            return ''
    displayed_clarec_detail.short_description = "Clarec Detail"

    def currency(self):
        return self.nostro_acct.ccy.code

    def drawing(self):
        return "{:,.2f}".format(abs(self.drawn_amt))

    def swift_bic(self):
        return self.nostro_acct.bank.swift_bic
    swift_bic.short_description = 'Bank'

    def acct_numb(self):
        return self.nostro_acct.number
    acct_numb.short_description = 'Account Number'

    @property
    def ledger(self):
        return LedgerAccount.objects.get(external_number=self.nostro_acct)

    @classmethod
    def get_unmatched(cls, unmatched):
        if isinstance(unmatched, UnmatchedRecons):
            unmatched = unmatched.pk

        try:
            unmatched_obj = UnmatchedRecons.objects.get(pk=unmatched)
            return unmatched_obj.unmatched_lcees.get()
        except ObjectDoesNotExist:
            return None

    def set_narration_and_entry_code(self):
        """set the narration and entry code"""

        entry_code = EntryCode.objects.get(code='AVL')

        if self.dr_cr == 'D' and self.flex_swift == 'S':
            narration = '%s AVAILED' % self.lc_number
            cr_acct = self.ledger
            dr_acct = self.memo_acct
        elif self.dr_cr == 'C' and self.flex_swift == 'S':
            narration = 'CVR FOR %s' % self.lc_number
            entry_code = EntryCode.objects.get(code='TRF')
            dr_acct = self.ledger
            cr_acct = self.memo_acct
        elif self.dr_cr == 'D' and self.flex_swift == 'F':
            narration = \
                '%s FUND EARLIER MOVED AND ENTRY PASSED' % self.lc_number
            dr_acct = self.memo_acct
            cr_acct = self.ledger
        elif self.dr_cr == 'C' and self.flex_swift == 'F':
            narration = '%s AVAILED EARLIER' % self.lc_number
            dr_acct = self.ledger
            cr_acct = self.memo_acct
        else:
            raise Exception('SOMETHING IS WRONG PLS CHECK.')

        return narration, entry_code, dr_acct, cr_acct

    def avail(self):
        entry_gen_trxn = EntryGeneratingTransaction.objects.get(
            short_name='AVAILMENT')

        narration, entry_code, dr_acct, cr_acct = \
            self.set_narration_and_entry_code()

        contras = EntryContra.objects.filter(
            amount=self.drawn_amt,
            code=entry_code,
            narration__contains=self.lc_number)

        if contras.exists():
            for contra in contras:
                if contra.content_object == self:
                    return False

        post_data = []
        for amt, acct in (
                (-self.drawn_amt, dr_acct), (self.drawn_amt, cr_acct)):

            post_data.append({
                'account': acct,
                'amount': amt,
                'narration': narration,
                'entry_code': entry_code,
                'entry_gen_trxn': entry_gen_trxn,
                'unmatched': self.unmatched,
                'model': self})

        return EntryContra.post_entry(*post_data)

    class Meta:
        db_table = 'lc_availed'
        verbose_name = "LC Availment"
        verbose_name_plural = "LC Availment"
        app_label = 'lcavail'

pre_save.connect(
    LcAvailed.lc_availed_pre_save,
    sender=LcAvailed,
    dispatch_uid='89y3jicv1408478527.337904)\%\jknki'
)


@receiver(post_save, sender=EntryContra, dispatch_uid="278gcvs7&$nbghw2-")
def update_lcavail_date(sender, **kwargs):
    contra = kwargs['instance']
    if not kwargs['created'] and contra.date_posted:
        ctype = ContentType.objects.get_for_model(LcAvailed)
        if contra.content_type == ctype:
            lc = contra.content_object
            lc.avail_date = contra.date_posted
            lc.save()


class LCCoverMovement(models.Model):
    lc_number = models.CharField('LC Number', max_length=16)
    amount = models.DecimalField("Amount Moved", max_digits=20, decimal_places=2)
    acct = models.ForeignKey(NostroAccount, verbose_name='Nostro Account')
    memo_acct = models.ForeignKey(LedgerAccount, verbose_name='Memo Cash')
    date_entry_passed = models.DateField('Date Entry Passed', null=True, blank=True)
    swift_text = models.TextField('Swift Text', null=True, blank=True)
    date_created = models.DateField('Date Created', auto_now_add=True)

    class Meta:
        db_table = 'lc_cv_mvt'
        verbose_name = 'LC Cover Movement'
        verbose_name_plural = 'LC Cover Movements'
        unique_together = ('lc_number', 'acct', 'date_entry_passed', 'amount',)

    def __unicode__(self):
        return "[%s: %s: %s]" % (self.lc_number,
                                 self.acct,
                                 self.amount_fmt(),)

    def amount_fmt(self):
        return '{:,.2f}'.format(self.amount)

    def post(self):
        entry_gen_trxn = EntryGeneratingTransaction.objects.get(
            short_name='AVAILMENT')

        narration = 'COVER MOVEMENT %s' % self.lc_number
        entry_code = EntryCode.objects.get(code='TRF')
        dr_acct = LedgerAccount.objects.get(external_number=self.acct)
        cr_acct = self.memo_acct

        contras = EntryContra.objects.filter(
            amount=self.amount,
            code=entry_code,
            narration=narration)

        if contras.exists():
            for contra in contras:
                if contra.content_object == self:
                    return False

        post_data = []
        for amt, acct in ((-self.amount, dr_acct), (self.amount, cr_acct)):

            post_data.append({
                'account': acct,
                'amount': amt,
                'narration': narration,
                'entry_code': entry_code,
                'entry_gen_trxn': entry_gen_trxn,
                'model': self})

        return EntryContra.post_entry(*post_data)


@receiver(post_save, sender=EntryContra, dispatch_uid="278gcvs7&$nbbbb2751(&2-")
def update_cv_mvmt_date(sender, **kwargs):
    contra = kwargs['instance']
    if not kwargs['created'] and contra.date_posted:
        ctype = ContentType.objects.get_for_model(LCCoverMovement)
        if contra.content_type == ctype:
            mvmt = contra.content_object
            mvmt.date_entry_passed = contra.date_posted
            mvmt.save()


@receiver(pre_save, sender=LCCoverMovement, dispatch_uid="-=?61@Qcvs7&$nbbbb2751(&2-")
def cover_mvmt_presave_check(sender, **kwargs):
    mvmt = kwargs['instance']
    if mvmt.acct.ccy != mvmt.memo_acct.ccy:
        raise ValidationError(
            'Wrong memo cash for selected nostro account.\nnostro.ccy: %s\nmemo.ccy: %s' % (
                mvmt.acct.ccy, mvmt.memo_acct.ccy))

    if not mvmt.pk and sender.objects.filter(
            lc_number=mvmt.lc_number, acct=mvmt.acct,
            amount=mvmt.amount).exists():
        raise IntegrityError(
            'LC Number, Account and amount must be unique together')
