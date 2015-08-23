# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UndrawnBal'
        db.create_table('undrawn', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('lc_numb', self.gf('django.db.models.fields.CharField')(max_length=16)),
            ('estb_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('claim_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('surplus_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('applicant', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('source_fund', self.gf('django.db.models.fields.CharField')(max_length=4)),
            ('formm_numb', self.gf('django.db.models.fields.CharField')(max_length=21, null=True, blank=True)),
            ('rate', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=14, decimal_places=7, blank=True)),
        ))
        db.send_create_signal(u'undrawnbal', ['UndrawnBal'])


    def backwards(self, orm):
        # Deleting model 'UndrawnBal'
        db.delete_table('undrawn')


    models = {
        u'undrawnbal.undrawnbal': {
            'Meta': {'object_name': 'UndrawnBal', 'db_table': "'undrawn'"},
            'applicant': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'claim_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'estb_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'formm_numb': ('django.db.models.fields.CharField', [], {'max_length': '21', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_numb': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            'rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '14', 'decimal_places': '7', 'blank': 'True'}),
            'source_fund': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'surplus_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'})
        }
    }

    complete_apps = ['undrawnbal']