from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from adhocmodels.models import NostroAccount
import os
import time


def get_file_path(obj, filename):
    ext = os.path.splitext(filename)[1]
    now = str(time.time()).replace('.', '')
    return 'nostchgs/%s%s' % (now, ext)


class NostroChgsFormA(models.Model):
    completion_date = models.DateField('Date Completed', auto_now_add=True)
    amount = models.DecimalField("Amount", decimal_places=2, max_digits=20)
    acct = models.ForeignKey(NostroAccount, verbose_name='Account')
    approved_by = models.CharField('Approved By', max_length=1000)
    swift_ref = models.CharField(
        'Swift Ref.', max_length=16, editable=False)
    form_a_ref = models.CharField('Form A Ref.', max_length=20, null=True)
    approval_file = models.FileField(
        upload_to=get_file_path, null=True, blank=True)

    class Meta:
        db_table = 'nostro_chgs_form_a'
        verbose_name = 'Nostro Charge Paid Via Form A'
        verbose_name_plural = 'Nostro Charges Paid Via Form A'

    def amount_fmt(self):
        return '{:,.2f}'.format(self.amount)
    amount_fmt.short_description = 'Amount'


@receiver(post_save, sender=NostroChgsFormA, dispatch_uid="098gcv^-+2nbghw2-")
def set_swift_ref(sender, **kwargs):
    nostro_chg = kwargs['instance']

    if not nostro_chg.swift_ref:
        yr = str(nostro_chg.completion_date.year)
        qs = sender.objects.filter(completion_date__year=yr)
        count = str(qs.count())

        nostro_chg.swift_ref = "NOSTFMA%s%s%s" % (
            yr[2:],
            ''.join('0' for x in range(7 - len(count))),
            count,
        )
        nostro_chg.save()
