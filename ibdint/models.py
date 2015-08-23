from django.db import models
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from adhocmodels. models import (
    Customer,
    NostroAccount,
    ValidTransactionRef,
    LedgerAccount)
from postentry.models import EntryContra, EntryCode, EntryGeneratingTransaction
from unmatched.models import UnmatchedRecons


class IbdInt(models.Model):
    valdate_in_ca = models.DateField("Value date In C/A")
    date_processed = models.DateField("Date Processed", auto_now_add=True)
    lc_number = models.CharField("LC Number", max_length=16)
    overseas_ref = models.CharField(
        "Overseas Bank Ref", max_length=16, null=True, blank=True)
    acct = models.ForeignKey(
        NostroAccount,
        db_column='acct',
        verbose_name='Account'
    )
    customer = models.ForeignKey(
        Customer,
        null=True,
        blank=True,
        db_column='customer',)
    amount = models.DecimalField(
        "Interest Amount", max_digits=9, decimal_places=2)
    valdate_in_pl = models.DateField(
        "Date Paid into P and L", blank=True, null=True)
    clarec_details = models.CharField(max_length=1000, blank=True, null=True)
    entry_seq = models.CharField(
        "Flexcube ID", max_length=16, blank=True, null=True, editable=False)
    unmatched = models.ForeignKey(
        UnmatchedRecons, null=True, blank=True, editable=False,
        related_name='unmatched_itfs')

    def __unicode__(self):
        return '[lc=%s: amount=%s %s]' % (
            self.lc_number, self.currency(), self.amountformat())

    def save(self, *args, **kwargs):
        if self.lc_number[:4] not in ValidTransactionRef.objects.values_list(
                'valid_ref_start', flat=True):
            raise ValidationError('Invalid Lc number: %s' % self.lc_number)

        if self.clarec_details:
            self.clarec_details = self.clarec_details.strip()

        super(IbdInt, self).save(*args, **kwargs)

    def display_clarec_details(self):
        if self.clarec_details:
            return self.clarec_details[:20]
        else:
            return ''
    display_clarec_details.short_description = 'Clarec Details'

    def amountformat(self):
        return "{:,.2f}".format(self.amount)
    amountformat.short_description = 'Amount'

    def rel_manager(self):
        return self.customer.rel_manager

    def rm_name(self):
        if self.customer:
            rel = self.rel_manager()
            return rel and rel.name or 'No RM'
        return 'No RM'

    def currency(self):
        return self.acct.ccy.code

    def bank(self):
        return self.acct.bank.swift_bic

    def write_posting(self):
        assert self.customer is not None, 'You must provide customer details'

        entry_code = EntryCode.objects.get(code='AAT')
        entry_gen_trxn = EntryGeneratingTransaction.objects.get(
            short_name='ITF INTEREST')
        narration = 'ITF INTEREST %s %s' % (
            self.lc_number, self.customer.name)

        contras = EntryContra.objects.filter(
            amount=self.amount,
            code=entry_code,
            narration=narration,
            entry_gen_trxn=entry_gen_trxn)

        if contras.exists():
            for contra in contras:
                if contra.content_object == self:
                    return False

        post_data = []

        for amt in (self.amount, -self.amount):
            if amt > 0:
                acct = LedgerAccount.objects.get(
                    number='IN3101010 %s' % self.currency())
                rm_code = self.rel_manager() and \
                    self.rel_manager().rmcode or ''
                brn = self.customer.branch_for_itf
                if brn:
                    code = brn.code
                    branch_for_itf_int = code != '026' and code or ''
                else:
                    branch_for_itf_int = 'NO ITF BRN'

            else:
                acct = LedgerAccount.objects.get(external_number=self.acct)
                rm_code = ''
                branch_for_itf_int = ''

            post_data.append(
                {
                 'amount': amt,
                 'account': acct,
                 'ref': self.lc_number,
                 'narration': narration,
                 'rm_code': rm_code,
                 'branch_for_itf_int': branch_for_itf_int,
                 'entry_code': entry_code,
                 'entry_gen_trxn': entry_gen_trxn,
                 'model': self
                }
            )

        return EntryContra.post_entry(*post_data)

    class Meta:
        db_table = 'ibd_int'
        verbose_name = "IBD Interest"
        verbose_name_plural = "IBD Interests"
        app_label = "ibdint"
        ordering = ('date_processed', "valdate_in_ca",)


@receiver(post_save, sender=EntryContra, dispatch_uid='&^^Vh5428253*')
def update_valdate_in_pl(sender, **kwargs):
    contra = kwargs['instance']
    if not kwargs['created'] and contra.date_posted:
        ctype = ContentType.objects.get_for_model(IbdInt)
        if ctype == contra.content_type:
            itf_int = contra.content_object
            itf_int.valdate_in_pl = contra.date_posted
            itf_int.save()
