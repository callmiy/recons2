from django.db import models
from django.core.exceptions import ValidationError
from adhocmodels.models.branch import Branch


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


class Customer(models.Model):
    name = models.CharField('Name', max_length=200)
    rel_manager = models.ForeignKey(
            RelationshipManager, related_name='clients', null=True, blank=True, db_column='rel_manager')
    branch_for_itf = models.ForeignKey(Branch, null=True, blank=True, db_column='brn_itf')
    parent = models.ForeignKey("self", null=True, blank=True, related_name='subsidiaries', db_column='parent')

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
