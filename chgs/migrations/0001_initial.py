# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Charge'
        db.create_table('chg', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('ccy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Currency'], db_column='ccy')),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=2)),
            ('overseas_ref', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
            ('customer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Customer'], null=True, db_column='customer', blank=True)),
            ('date_processed', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('val_date_dr', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('val_date_adv', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('req_bank', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.OverseasBank'], db_column='req_bank')),
            ('cr_acct', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.NostroAccount'], null=True, db_column='cr_acct', blank=True)),
            ('tkt_req_date', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('tkt_mvd_date', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('swift_txt', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('lc_number', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
            ('entry_seq', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
        ))
        db.send_create_signal('chgs', ['Charge'])


    def backwards(self, orm):
        # Deleting model 'Charge'
        db.delete_table('chg')


    models = {
        'adhocmodels.branch': {
            'Meta': {'ordering': "('name', 'code')", 'object_name': 'Branch', 'db_table': "'branch'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'adhocmodels.currency': {
            'Meta': {'ordering': "('code',)", 'object_name': 'Currency', 'db_table': "'currency'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'adhocmodels.customer': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Customer', 'db_table': "'customer'"},
            'branch_for_itf': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Branch']", 'null': 'True', 'db_column': "'brn_itf'", 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'subsidiaries'", 'null': 'True', 'db_column': "'parent'", 'to': "orm['adhocmodels.Customer']"}),
            'rel_manager': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'clients'", 'null': 'True', 'db_column': "'rel_manager'", 'to': "orm['adhocmodels.RelationshipManager']"})
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
        'adhocmodels.relationshipmanager': {
            'Meta': {'ordering': "('name', 'rmcode')", 'object_name': 'RelationshipManager', 'db_table': "'rel_manager'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'rel_managers'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rmcode': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15'})
        },
        'chgs.charge': {
            'Meta': {'ordering': "('val_date_dr', '-id')", 'object_name': 'Charge', 'db_table': "'chg'"},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '2'}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Currency']", 'db_column': "'ccy'"}),
            'cr_acct': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']", 'null': 'True', 'db_column': "'cr_acct'", 'blank': 'True'}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']", 'null': 'True', 'db_column': "'customer'", 'blank': 'True'}),
            'date_processed': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'entry_seq': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_number': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            'overseas_ref': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            'req_bank': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.OverseasBank']", 'db_column': "'req_bank'"}),
            'swift_txt': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'tkt_mvd_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'tkt_req_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'val_date_adv': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'val_date_dr': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['chgs']