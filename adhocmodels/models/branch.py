from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError
from core_recons.utilities import prepend_zeros


class Branch(models.Model):
    code = models.CharField("Branch Code", max_length=3, unique=True)
    name = models.CharField("Branch Name", max_length=50)

    def save(self, *args, **kwargs):
        self.code = str(self.code)
        if not self.code.isdigit():
            raise ValidationError("Only numbers allowed for branch code")
        self.name = self.name.upper()

        len_code = len(self.code)
        if len_code < 3:
            self.code = '%s%s' % (prepend_zeros(3, len_code), self.code)

        super(Branch, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s: %s' % (self.name, self.code,)

    def view_value(self):
        return self.__unicode__()

    @classmethod
    def search_param(cls, qs, name_code):
        if not name_code:
            return qs

        return qs.filter(Q(code__contains=name_code) | Q(name__icontains=name_code))

    class Meta:
        db_table = 'branch'
        app_label = 'adhocmodels'
        ordering = ('name', 'code',)
        verbose_name_plural = "Branches"
