from django.db import models


class UploadedFormM(models.Model):
    ba = models.CharField('BA Number', max_length=16)
    mf = models.CharField('Form M Number', max_length=13)
    ccy = models.CharField('Currency', max_length=3)
    fob = models.DecimalField('FOB Value', decimal_places=2, max_digits=18)
    applicant = models.CharField('Applicant', max_length=300)
    goods_description = models.CharField('Goods Description', max_length=1000, null=True, blank=True)
    cost_freight = models.DecimalField('Cost and freight', decimal_places=2, max_digits=18, null=True, blank=True)
    validity_type = models.CharField('Validity Type', max_length=100, null=True, blank=True)
    status = models.CharField('Status', max_length=20, null=True, blank=True)
    submitted_at = models.DateField('Date Submitted')
    validated_at = models.DateField('Date Validated', null=True, blank=True)
    uploaded_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'uploaded_form_m'
        app_label = 'letter_of_credit'

    def __unicode__(self):
        return '[%s | %s%s | %s]' % (
            self.mf,
            self.ccy,
            self.fob_formatted(),
            self.applicant
        )

    def fob_formatted(self):
        return '{:,.2f}'.format(self.fob)

    fob_formatted.short_description = 'FOB'

    def cost_freight_formatted(self):
        return '{:,.2f}'.format(self.cost_freight or 0)

    cost_freight_formatted.short_description = 'Cost and freight'
