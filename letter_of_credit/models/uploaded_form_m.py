from django.db import models


class UploadedFormM(models.Model):
    ba = models.CharField('BA Number', max_length=16)
    mf = models.CharField('Form M Number', max_length=13)
    ccy = models.CharField('Currency', max_length=3)
    fob = models.DecimalField('FOB Value', decimal_places=2, max_digits=18)
    applicant = models.CharField('Applicant', max_length=300)
    submitted_at = models.DateField('Date Submitted')
    validated_at = models.DateField('Date Validated')
    uploaded_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'uploaded_form_m'
        app_label = 'letter_of_credit'

    def __unicode__(self):
        return '[%s | %s%s | %s]' % (
            self.mf,
            self.ccy,
            '{:,.2f}'.format(self.fob),
            self.name
        )
