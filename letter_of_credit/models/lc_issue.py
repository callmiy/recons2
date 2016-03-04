from django.db import models
from letter_of_credit.models.form_m import FormM
import re

ISSUE_TEXT_RE = re.compile(':ISSUE', re.IGNORECASE)


class LCIssue(models.Model):
    text = models.CharField('Issue Text', max_length=300)

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'lc_issue'
        verbose_name = 'LC Issue'
        verbose_name_plural = 'LC Issue'

    def __unicode__(self):
        return self.text

    def save(self, *args, **kwargs):
        self.text = '%s:ISSUE' % ISSUE_TEXT_RE.sub('', self.text)
        super(LCIssue, self).save(*args, **kwargs)


class LCIssueConcrete(models.Model):
    issue = models.ForeignKey(LCIssue, verbose_name='Issue')
    mf = models.ForeignKey(FormM, verbose_name='Related Form M', related_name='form_m_issues')
    created_at = models.DateField('Date Created', auto_now_add=True)
    closed_at = models.DateField('Date Closed', null=True, blank=True)

    class Meta:
        db_table = 'lc_issue_concrete'
        app_label = 'letter_of_credit'
        verbose_name = 'LC Issue Concrete'
        verbose_name_plural = 'LC Issue Concrete'

    def __unicode__(self):
        return '%s: %s' % (self.mf.number, self.issue.text)

    def save(self, *args, **kwargs):
        super(LCIssueConcrete, self).save(*args, **kwargs)

    def form_m_number(self):
        return self.mf.number

    def applicant(self):
        return self.mf.applicant

    def lc_number(self):
        return self.mf.lc and self.mf.lc.lc_number or None
