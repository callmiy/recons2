from django.db import models


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
    bank = models.ForeignKey(OverseasBank, related_name='my_nostros', verbose_name='Overseas Bank Name',
                             db_column='bank')
    ccy = models.ForeignKey(Currency, related_name='ccy_nostros', verbose_name='Currency', db_column='ccy')
    number = models.CharField('Account Number', max_length=60, unique=True)
    name = models.CharField('Account Name', max_length=1000, blank=True, null=True)

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
