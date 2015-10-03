from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
import re
from .general import Currency, NostroAccount


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
    acct_type = models.ForeignKey(LedgerAccountType, db_column='acct_type', related_name='ledger_acct_types',
                                  verbose_name='Account Type')
    ccy = models.ForeignKey(Currency, db_column='ccy')
    external_number = models.ForeignKey(
        NostroAccount,
        null=True,
        blank=True,
        verbose_name='External Acct. Number',
        db_column='external_number',
        related_name='ledger_acct'
    )
    is_default_memo = models.BooleanField('Default For Memo Cash Account?', default=False)
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
