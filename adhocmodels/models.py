from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
import re

prepend_zeros = lambda reqd, available: ''.join('0' for c in range(
    reqd - available)
                                                )


class Branch(models.Model):
    code = models.CharField("Branch Code", max_length=3, unique=True)
    name = models.CharField("Branch Name", max_length=50)

    def save(self, *args, **kwargs):
        if not self.code.isdigit():
            raise ValidationError("Only numbers allowed for branch code")
        self.name = self.name.upper()

        len_code = len(self.code)
        if len_code < 3:
            self.code = '%s%s' % (prepend_zeros(3, len_code), self.code)

        super(Branch, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: %s' % (self.name, self.code,)

    @classmethod
    def search_param(cls, qs, name_code):
        if not name_code:
            return qs

        return qs.filter(Q(code__contains=name_code) | Q(name__icontains=name_code))

    class Meta:
        db_table = 'branch'
        app_label = 'adhocmodels'
        ordering = ('name', 'code',)
        verbose_name_plural = "Branches"


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


class RelationshipManager(models.Model):
    name = models.CharField("Name", max_length=50)
    rmcode = models.CharField("RM Code", max_length=15, unique=True)
    branch = models.ForeignKey(Branch, related_name='rel_managers')

    def save(self, *args, **kwargs):
        self.name = self.name.upper()
        self.rmcode = self.rmcode.upper()
        super(RelationshipManager, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: %s' % (self.name, self.rmcode)

    class Meta:
        db_table = 'rel_manager'
        ordering = ('name', 'rmcode',)
        app_label = 'adhocmodels'
        verbose_name = 'Relationship Manager'
        verbose_name_plural = "Relationship Managers"


class AccountNumber(models.Model):
    nuban = models.CharField("Nuban", max_length=10, unique=True)
    old_numb = models.CharField(
        'Old Acct. Number', max_length=13, null=True, blank=True)
    owner = models.ForeignKey(
        'Customer', related_name='acct_numbs', verbose_name='Customer Name')
    branch = models.ForeignKey(Branch, related_name='accts')
    acct_id = models.CharField(
        'Customer ID For Acct.', max_length=10, unique=True, )

    def save(self, *args, **kwargs):
        if not self.nuban.isdigit:
            raise ValidationError("Account Numbers can only contain numbers")

        REQD_DIGITS_NUBAN = 10
        REQD_DIGITS_OLD_NUMB = 13

        len_nuban = len(self.nuban)

        if len_nuban < REQD_DIGITS_NUBAN:
            self.nuban = '%s%s' % (
                prepend_zeros(REQD_DIGITS_NUBAN, len_nuban), self.nuban)

        if self.old_numb:
            if not self.old_numb.isdigit():
                raise ValidationError(
                    "Account Numbers can only contain numbers")

            len_old_numb = len(self.old_numb)

            if len_old_numb < REQD_DIGITS_OLD_NUMB:
                self.old_numb = '%s%s' % (
                    prepend_zeros(REQD_DIGITS_OLD_NUMB, len_old_numb),
                    self.old_numb,
                )

        super(AccountNumber, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: owner=%s | branch=%s' % (
            self.nuban, self.owner, self.branch
        )

    class Meta:
        db_table = 'acct_numb'
        app_label = 'adhocmodels'
        ordering = ('owner', 'nuban',)


class Customer(models.Model):
    name = models.CharField('Name', max_length=200)
    rel_manager = models.ForeignKey(
        RelationshipManager, related_name='clients', null=True, blank=True,
        db_column='rel_manager')
    branch_for_itf = models.ForeignKey(
        Branch, null=True, blank=True, db_column='brn_itf')
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name='subsidiaries',
        db_column='parent')

    class Meta:
        db_table = 'customer'
        app_label = 'adhocmodels'
        ordering = ('name',)

    def save(self, *args, **kwargs):
        self.name = self.name.upper()

        if self.parent and not self.parent.acct_numbers:
            raise ValidationError(
                'Parent Company must have at least one account number')

        super(Customer, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.name

    @property
    def isparent(self):
        return not self.parent and self.subsidiaries.all()

    @property
    def issubsidiary(self):
        return self.parent and not self.isparent

    @property
    def acct_numbers(self):
        if self.acct_numbs.all():
            return self.acct_numbs.all()

        elif self.issubsidiary:
            return self.parent.acct_numbers

        else:
            return self.acct_numbs.all()

    def subsidiary_status(self):
        if self.isparent:
            return 'PARENT COY'
        elif self.issubsidiary:
            return 'SUBSIDIARY'
        else:
            return 'NONE'

    subsidiary_status.short_description = 'STATUS'

    @property
    def rm(self):
        if self.issubsidiary:
            return self.parent.rel_manager
        else:
            return self.rel_manager

    def rman(self):
        """for the admin cos admin wouldnt allow methods decorated
        with @ property.
        """
        return self.rm

    rman.short_description = 'Relationship Manager'

    def brn_name(self):
        return self.acct_numbers[0].branch.name

    def brn_code(self):
        return self.acct_numbers[0].branch.code

    def acct_id(self):
        return self.acct_numbers[0].acct_id

    def acct_numb(self):
        return self.acct_numbers[0].nuban


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
    valid_ref_start = models.CharField(
        'First four digits of reference', max_length=16)

    def save(self, *args, **kwargs):
        self.valid_ref_start = self.valid_ref_start[:4].upper()
        super(ValidTransactionRef, self).save(*args, **kwargs)

    @classmethod
    def is_valid_trxn_ref(cls, inref):
        return any(
            [inref[:4].upper() == ref.valid_ref_start
             for ref in cls.objects.all()])

    class Meta:
        db_table = 'valid_refs'
        verbose_name = 'Valid Transaction Reference'
        verbose_name_plural = 'Valid Transaction References'
        app_label = 'adhocmodels'
