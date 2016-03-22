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
