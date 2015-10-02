from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError

prepend_zeros = lambda reqd, available: ''.join('0' for c in range(reqd - available))


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

    def view_value(self):
        return self.__unicode__()

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
    old_numb = models.CharField('Old Acct. Number', max_length=13, null=True, blank=True)
    owner = models.ForeignKey('Customer', related_name='acct_numbs', verbose_name='Customer Name')
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
        RelationshipManager, related_name='clients', null=True, blank=True, db_column='rel_manager')
    branch_for_itf = models.ForeignKey(Branch, null=True, blank=True, db_column='brn_itf')
    parent = models.ForeignKey(
        "self", null=True, blank=True, related_name='subsidiaries', db_column='parent')

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
