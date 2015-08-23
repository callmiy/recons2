# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'UndrawnBal.estb_amt_ccy'
        db.add_column('undrawn', 'estb_amt_ccy',
                      self.gf('django.db.models.fields.related.ForeignKey')(default='', related_name='estb_amt_ccy', to=orm['adhocmodels.Currency']),
                      keep_default=False)

        # Adding field 'UndrawnBal.claim_amt_ccy'
        db.add_column('undrawn', 'claim_amt_ccy',
                      self.gf('django.db.models.fields.related.ForeignKey')(default='', related_name='claim_amt_ccy', to=orm['adhocmodels.Currency']),
                      keep_default=False)

        # Adding field 'UndrawnBal.surplus_amt_ccy'
        db.add_column('undrawn', 'surplus_amt_ccy',
                      self.gf('django.db.models.fields.related.ForeignKey')(default='', related_name='surplus_amt_ccy', to=orm['adhocmodels.Currency']),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'UndrawnBal.estb_amt_ccy'
        db.delete_column('undrawn', 'estb_amt_ccy_id')

        # Deleting field 'UndrawnBal.claim_amt_ccy'
        db.delete_column('undrawn', 'claim_amt_ccy_id')

        # Deleting field 'UndrawnBal.surplus_amt_ccy'
        db.delete_column('undrawn', 'surplus_amt_ccy_id')


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
        'adhocmodels.relationshipmanager': {
            'Meta': {'ordering': "('name', 'rmcode')", 'object_name': 'RelationshipManager', 'db_table': "'rel_manager'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'rel_managers'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rmcode': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15'})
        },
        u'undrawnbal.undrawnbal': {
            'Meta': {'object_name': 'UndrawnBal', 'db_table': "'undrawn'"},
            'applicant': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']"}),
            'claim_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'claim_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'claim_amt_ccy'", 'to': "orm['adhocmodels.Currency']"}),
            'estb_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'estb_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'estb_amt_ccy'", 'to': "orm['adhocmodels.Currency']"}),
            'formm_numb': ('django.db.models.fields.CharField', [], {'max_length': '21', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_numb': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            'rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '14', 'decimal_places': '7', 'blank': 'True'}),
            'source_fund': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'surplus_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'surplus_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'surplus_amt_ccy'", 'to': "orm['adhocmodels.Currency']"})
        }
    }

    complete_apps = ['undrawnbal']