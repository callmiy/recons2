from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
import re

from .customer import Branch, RelationshipManager, AccountNumber, Customer

prepend_zeros = lambda reqd, available: ''.join('0' for c in range(reqd - available))


class Currency(models.Model):
    code = models.CharField("Currency Code", max_length=3, unique=True)
    name = models.CharField("Currency Name", max_length=50)

    def save(self, *args, **kwargs):
        if not self.code.isalpha():
            raise ValueError('Only letters allowed for currency code.')
        self.code = self.code.upper()
        self.name = self.name.upper()
        super(Currency, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.code

    class Meta:
        db_table = 'currency'
        verbose_name_plural = "Currencies"
        app_label = 'adhocmodels'


class OverseasBank(models.Model):
    name = models.CharField("Bank Name", max_length=50)
    swift_bic = models.CharField("Swift Bic", max_length=11, unique=True)

    def save(self, *args, **kwargs):
        self.name = self.name.upper()
        self.swift_bic = self.swift_bic.upper()
        super(OverseasBank, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s: %s..' % (self.swift_bic, self.name[:20],)

    class Meta:
        db_table = 'overseas_bank'
        ordering = ("swift_bic", "name",)
        app_label = 'adhocmodels'
        verbose_name_plural = "Overseas Banks"


class NostroAccount(models.Model):
    bank = models.ForeignKey(
        OverseasBank, related_name='my_nostros',
        verbose_name='Overseas Bank Name', db_column='bank')
    ccy = models.ForeignKey(
        Currency, related_name='ccy_nostros',
        verbose_name='Currency', db_column='ccy')
    number = models.CharField('Account Number', max_length=60, unique=True)
    name = models.CharField(
        'Account Name', max_length=1000, blank=True, null=True)

    class Meta:
        db_table = 'nostro_acct'
        unique_together = ('bank', 'ccy', 'number',)
        app_label = 'adhocmodels'

    def save(self, *args, **kwargs):
        self.number = self.number.strip()
        if self.name:
            self.name = self.name.strip(' \n\r\t')
        return super(NostroAccount, self).save(*args, **kwargs)

    def __unicode__(self):
        return u'%s | %s | %s | %s' % (
            self.bank.swift_bic,
            self.number,
            self.ccy.code,
            self.name or '')

    @classmethod
    def get_instance_from_repr(cls, bic, acct, ccy):
        """Get an instance from the instance's __unicode__ string."""
        return cls.objects.get(bank__swift_bic=bic, number=acct, ccy__code=ccy)


class LedgerAccountType(models.Model):
    code = models.CharField("Account Code", max_length=4, unique=True)
    description = models.CharField(
        "Accout Type Description",
        max_length=100)

    def save(self, *args, **kwargs):
        CODE_RE = re.compile('[a-zA-Z0-9]{4}')
        if not CODE_RE.match(self.code):
            raise ValidationError(
                'Wrong format for ledger account code: %s' % self.code)

        self.code = self.code.upper()
        self.description = self.description.upper()
        super(LedgerAccountType, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: %s' % (self.code, self.description,)

    class Meta:
        db_table = 'ledger_acct_type'
        app_label = 'adhocmodels'
        ordering = ('code',)
        verbose_name = 'Ledger Account Type'
        verbose_name_plural = 'Ledger Account Types'


class LedgerAccount(models.Model):
    number = models.CharField("Account Number", max_length=60, unique=True)
    acct_type = models.ForeignKey(
        LedgerAccountType, db_column='acct_type',
        related_name='ledger_acct_types', verbose_name='Account Type')
    ccy = models.ForeignKey(Currency, db_column='ccy')
    external_number = models.ForeignKey(
        NostroAccount,
        null=True,
        blank=True,
        verbose_name='External Acct. Number',
        db_column='external_number',
        related_name='ledger_acct')
    is_default_memo = models.BooleanField(
        'Default For Memo Cash Account?', default=False)
    name = models.CharField('Account Name', max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'ledger_acct'
        verbose_name = 'Ledger Account'
        verbose_name_plural = 'Ledger Accounts'

    def __unicode__(self):
        return self.number

    def currency(self):
        return self.ccy.code

    def acct_type_display(self):
        return self.acct_type.code

    acct_type_display.short_description = 'Account Type'


@receiver(pre_save, sender=LedgerAccount, dispatch_uid='1403736920.856/-9-45298328huEb')
def ledger_acct_pre_save(sender, **kwargs):
    self = kwargs['instance']
    self.number = self.number.upper().strip(' \t\n\r')

    if self.acct_type.code == 'CASH' and 'CASH' not in self.number:
        raise ValidationError(
            'Incorrect Number for a cash security account.')

    if self.acct_type.code == 'MCSH' and 'MCSH' not in self.number:
        raise ValidationError(
            'Incorrect number for a memo cash account.')

    if self.acct_type.code == 'OTHN' and 'OTHN' not in self.number:
        raise ValidationError(
            'Incorrect number for a nostro other account')

    if self.external_number and self.external_number.ccy != self.ccy:
        raise ValidationError(
            "This ledger's currency must be %s" %
            "the same as external account's currency")

    ccy_re = re.compile('(%s)' % '|'.join(
        Currency.objects.values_list('code', flat=True)))

    ccy_found = ccy_re.search(self.number)

    if ccy_found and ccy_found.group(0) != self.ccy.code:
        raise ValidationError(
            "Wrong currency for this account type")

    if self.is_default_memo and 'MCSH' not in self.number:
        raise ValidationError(
            'Only memo cash account can be set as a default memo')


def get_default_memos():
    memos = {}
    for memo in LedgerAccount.objects.filter(is_default_memo=True):
        memos[memo.ccy.code] = {
            'number': memo.number,
            'name': memo.name,
            'id': memo.id,
        }
    return memos


class ValidTransactionRef(models.Model):
    valid_ref_start = models.CharField('First four digits of reference', max_length=16)

    def save(self, *args, **kwargs):
        self.valid_ref_start = self.valid_ref_start[:4].upper()
        super(ValidTransactionRef, self).save(*args, **kwargs)

    @classmethod
    def is_valid_trxn_ref(cls, inref):
        return any([inref[:4].upper() == ref.valid_ref_start for ref in cls.objects.all()])

    class Meta:
        db_table = 'valid_refs'
        verbose_name = 'Valid Transaction Reference'
        verbose_name_plural = 'Valid Transaction References'
        app_label = 'adhocmodels'
