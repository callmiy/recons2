from django.db import models
from core_recons.utilities import prepend_zeros
from adhocmodels.models.branch import Branch
from adhocmodels.models.currency import Currency
from django.core.exceptions import ValidationError


class AccountNumber(models.Model):
    nuban = models.CharField("Nuban", max_length=10, )
    currency = models.ForeignKey(Currency, related_name='acct_numb_currencies', )
    old_numb = models.CharField('Old Acct. Number', max_length=13, null=True, blank=True)
    owner = models.ForeignKey('Customer', related_name='acct_numbs', verbose_name='Customer Name')
    branch = models.ForeignKey(Branch, related_name='accts')
    acct_id = models.CharField('Customer ID For Acct.', max_length=10, )
    description = models.CharField('Description', max_length=300, null=True, blank=True)

    def save(self, *args, **kwargs):
        self.nuban = str(self.nuban)

        if not self.nuban.isdigit:
            raise ValidationError("Account Numbers can only contain numbers")

        reqd_digits_nuban = 10
        len_nuban = len(self.nuban)

        if len_nuban < reqd_digits_nuban:
            self.nuban = '%s%s' % (
                prepend_zeros(reqd_digits_nuban, len_nuban), self.nuban)

        super(AccountNumber, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: owner=%s | branch=%s' % (
            self.nuban, self.owner, self.branch
        )

    class Meta:
        db_table = 'acct_numb'
        app_label = 'adhocmodels'
        ordering = ('owner', 'nuban',)
        unique_together = ('nuban', 'currency', 'acct_id',)
