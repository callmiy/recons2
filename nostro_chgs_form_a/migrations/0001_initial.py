# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'NostroChgsFormA'
        db.create_table('nostro_chgs_form_a', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('completion_date', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('acct', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.NostroAccount'])),
            ('approved_by', self.gf('django.db.models.fields.CharField')(max_length=1000)),
            ('swift_ref', self.gf('django.db.models.fields.CharField')(max_length=16)),
            ('approval_file', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True)),
        ))
        db.send_create_signal(u'nostro_chgs_form_a', ['NostroChgsFormA'])


    def backwards(self, orm):
        # Deleting model 'NostroChgsFormA'
        db.delete_table('nostro_chgs_form_a')


    models = {
        'adhocmodels.currency': {
            'Meta': {'ordering': "('code',)", 'object_name': 'Currency', 'db_table': "'currency'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'adhocmodels.nostroaccount': {
            'Meta': {'ordering': "('bank',)", 'unique_together': "(('bank', 'ccy', 'number'),)", 'object_name': 'NostroAccount', 'db_table': "'nostro_acct'"},
            'bank': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'my_nostros'", 'db_column': "'bank'", 'to': "orm['adhocmodels.OverseasBank']"}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ccy_nostros'", 'db_column': "'ccy'", 'to': "orm['adhocmodels.Currency']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '60'})
        },
        'adhocmodels.overseasbank': {
            'Meta': {'ordering': "('swift_bic', 'name')", 'object_name': 'OverseasBank', 'db_table': "'overseas_bank'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'swift_bic': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '11'})
        },
        u'nostro_chgs_form_a.nostrochgsforma': {
            'Meta': {'object_name': 'NostroChgsFormA', 'db_table': "'nostro_chgs_form_a'"},
            'acct': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']"}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'approval_file': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True'}),
            'approved_by': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'completion_date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'swift_ref': ('django.db.models.fields.CharField', [], {'max_length': '16'})
        }
    }

    complete_apps = ['nostro_chgs_form_a']