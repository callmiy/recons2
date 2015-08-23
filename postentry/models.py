from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from adhocmodels.models import LedgerAccount
import re


class Entry(models.Model):
    amount = models.DecimalField("Amount", max_digits=14, decimal_places=2)
    time_created = models.DateTimeField('Time Created', auto_now_add=True)
    time_processed_for_posting = models.DateTimeField(
        'Time Processed For Posting', null=True, blank=True)

    def contras_dr_equals_cr(self):
        return sum(contra.amount for contra in self.contras.all()) == 0

    def is_posted(self):
        return self.date_posted is not None

    def amt_fmt(self):
        return '{:,.2f}'.format(self.amount)

    def __unicode__(self):
        return 'Entry: %s=%s' % (
            self.amt_fmt(),
            self.contras.values_list('amount', flat=True))

    class Meta:
        db_table = 'entry'
        app_label = 'postentry'
        verbose_name_plural = 'Entries'


class EntryCode(models.Model):
    code = models.CharField('Entry Code', max_length=3, unique=True)
    description = models.CharField("Entry Code Description", max_length=80)

    def __unicode__(self):
        return self.code

    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        self.description = self.description.upper()
        super(EntryCode, self).save(*args, **kwargs)

    class Meta:
        db_table = 'entry_code'
        app_label = 'postentry'
        ordering = ('code',)
        verbose_name = 'Entry Code'
        verbose_name_plural = 'Entry Codes'


class EntryGeneratingTransaction(models.Model):
    short_name = models.CharField(
        "Short Descriptive Name", max_length=20, unique=True)
    description = models.CharField(max_length=100)
    display = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        SHORT_DESC_RE = re.compile('[a-zA-Z0-9 ]+')
        if not SHORT_DESC_RE.match(self.short_name):
            raise Exception('Invalid Character for short description')

        self.short_name = self.short_name.upper()
        self.description = self.description.upper()
        super(EntryGeneratingTransaction, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.short_name

    class Meta:
        db_table = 'entry_gen_trxn'
        app_label = 'postentry'
        verbose_name = 'Entry Generating Transaction'
        verbose_name_plural = 'Entry Generating Transactions'


class EntryContra(models.Model):
    content_type = models.ForeignKey(ContentType, null=True, editable=False)
    object_id = models.PositiveIntegerField(
        'Object ID', null=True, editable=False)
    content_object = generic.GenericForeignKey('content_type', 'object_id')
    entry = models.ForeignKey(Entry, related_name='contras', db_column='entry')
    amount = models.DecimalField("Amount", max_digits=14, decimal_places=2)
    account = models.ForeignKey(LedgerAccount, db_column='account')
    code = models.ForeignKey(EntryCode, db_column='code')
    narration = models.CharField("Narration", max_length=100)
    ref = models.CharField(
        "Reference", max_length=16, blank=True, null=True, editable=False)
    rm_code = models.CharField('RM CODE', max_length=12, blank=True, null=True)
    entry_gen_trxn = models.ForeignKey(
        EntryGeneratingTransaction, db_column='entry_gen_trxn', null=True)
    branch_for_itf_int = models.CharField(
        'BRANCH FOR ITF INT', max_length=3, blank=True, null=True)
    flex_id = models.CharField('Flex ID', max_length=20, null=True, blank=True)
    date_posted = models.DateField('Date Posted', null=True, blank=True)
    unmatched = models.IntegerField(
        "Unmatched ID", null=True, blank=True, editable=False)

    def add_flex_id(self, flexid):
        fids = EntryContra.objects.filter(
            flex_id__contains=flexid).get_values('id', flat=True)
        if fids.exists():
            return

    def dr_cr(self):
        return 'DR' if self.amount < 0 else 'CR'
    dr_cr.short_description = 'DR/CR'

    def amt_fmt(self):
        return '{:,.2f}'.format(abs(self.amount))

    def entry_code(self):
        return self.code.code
    entry_code.short_description = 'ENTRY CODE'

    def entry_gen_trxn_display(self):
        return self.entry_gen_trxn.short_name
    entry_gen_trxn_display.short_description = 'TRANSACTION TYPE'

    def time_created(self):
        return self.entry.time_created

    @classmethod
    def update_post_date(cls, queryset, dateval):
        for obj in queryset:
            obj.entry.date_posted = dateval
            obj.entry.save()

    @classmethod
    def post_entry(cls, *entries):
        entries = sorted(entries, key=lambda mapping: -mapping['amount'])

        sum_dr_amounts = sum(
            [entry['amount'] for entry in entries if entry['amount'] < 0])
        sum_cr_amounts = sum(
            [entry['amount'] for entry in entries if entry['amount'] > 0])

        if (sum_dr_amounts + sum_cr_amounts) != 0:
            raise Exception(
                """Posting data is not balanced for this entry
                   sum_dr_amounts=%s
                   sum_cr_amounts=%s""" % (sum_dr_amounts, sum_cr_amounts)
            )

        entry_obj = Entry.objects.create(amount=abs(sum_dr_amounts))

        for entry in entries:
            assert len(entry) >= 5, 'There must be at least 6 post data'

            obj = cls(
                entry=entry_obj,
                amount=entry['amount'],
                account=entry['account'],
                narration=entry['narration'],
                rm_code=entry.get('rm_code', ''),
                branch_for_itf_int=entry.get('brn', ''),
                code=entry['entry_code'],
                entry_gen_trxn=entry.get('entry_gen_trxn'),
            )

            model = entry.get('model')
            if model:
                obj.content_object = model
            obj.save()

        return True

    class Meta:
        db_table = 'entry_contra'
        app_label = 'postentry'
        verbose_name = 'Entry Contra'
        verbose_name_plural = 'Entry Contras'
