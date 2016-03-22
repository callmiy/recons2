from django.db import models
from core_recons.utilities import prepend_zeros
from adhocmodels.models.branch import Branch
from adhocmodels.models.currency import Currency
from django.core.exceptions import ValidationError


class AccountNumber(models.Model):
    nuban = models.CharField("Nuban", max_length=10, unique=True)
    currency = models.ForeignKey(Currency, related_name='acct_numb_currencies',)
    old_numb = models.CharField('Old Acct. Number', max_length=13, null=True, blank=True)
    owner = models.ForeignKey('Customer', related_name='acct_numbs', verbose_name='Customer Name')
    branch = models.ForeignKey(Branch, related_name='accts')
    acct_id = models.CharField('Customer ID For Acct.', max_length=10, unique=True, )

    def save(self, *args, **kwargs):
        self.nuban = str(self.nuban)

        if not self.nuban.isdigit:
            raise ValidationError("Account Numbers can only contain numbers")

        reqd_digits_nuban = 10
        reqd_digits_old_numb = 13

        len_nuban = len(self.nuban)

        if len_nuban < reqd_digits_nuban:
            self.nuban = '%s%s' % (
                prepend_zeros(reqd_digits_nuban, len_nuban), self.nuban)

        if self.old_numb:
            if not self.old_numb.isdigit():
                raise ValidationError(
                        "Account Numbers can only contain numbers")

            len_old_numb = len(self.old_numb)

            if len_old_numb < reqd_digits_old_numb:
                self.old_numb = '%s%s' % (
                    prepend_zeros(reqd_digits_old_numb, len_old_numb),
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
