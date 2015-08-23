# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'UndrawnBal.customer'
        db.add_column('undrawn', 'customer',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='cust_undrawn_bals', null=True, to=orm['adhocmodels.Customer']),
                      keep_default=False)


        # Changing field 'UndrawnBal.applicant'
        db.alter_column('undrawn', 'applicant_id', self.gf('django.db.models.fields.related.ForeignKey')(null=True, to=orm['adhocmodels.Customer']))

    def backwards(self, orm):
        # Deleting field 'UndrawnBal.customer'
        db.delete_column('undrawn', 'customer_id')


        # Changing field 'UndrawnBal.applicant'
        db.alter_column('undrawn', 'applicant_id', self.gf('django.db.models.fields.related.ForeignKey')(default='', to=orm['adhocmodels.Customer']))

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
        'postentry.entrygeneratingtransaction': {
            'Meta': {'object_name': 'EntryGeneratingTransaction', 'db_table': "'entry_gen_trxn'"},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'short_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20'})
        },
        u'undrawnbal.sourcefx': {
            'Meta': {'object_name': 'SourceFx', 'db_table': "'source_fx'"},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'undrawnbal.undrawnbal': {
            'Meta': {'object_name': 'UndrawnBal', 'db_table': "'undrawn'"},
            'applicant': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'applll_undrawn_bals'", 'null': 'True', 'to': "orm['adhocmodels.Customer']"}),
            'claim_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'claim_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'claim_amt_ccy'", 'to': "orm['adhocmodels.Currency']"}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'cust_undrawn_bals'", 'null': 'True', 'to': "orm['adhocmodels.Customer']"}),
            'estb_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'estb_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'estb_amt_ccy'", 'to': "orm['adhocmodels.Currency']"}),
            'formm_numb': ('django.db.models.fields.CharField', [], {'max_length': '21', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_numb': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            'nostro': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'undrawn_nostros'", 'to': "orm['adhocmodels.NostroAccount']"}),
            'rate': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '14', 'decimal_places': '7', 'blank': 'True'}),
            'source_fund': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['undrawnbal.SourceFx']"}),
            'surplus_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'surplus_amt_ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'surplus_amt_ccy'", 'to': "orm['adhocmodels.Currency']"}),
            'ticket_no': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'unmatched': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'unmatched_undrawns'", 'null': 'True', 'to': "orm['unmatched.UnmatchedRecons']"})
        },
        'unmatched.unmatchedrecons': {
            'Meta': {'ordering': "('valdate',)", 'object_name': 'UnmatchedRecons', 'db_table': "'unmatched_recons'"},
            'acct_numb': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']", 'db_column': "'acct_numb'"}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '16', 'decimal_places': '2'}),
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']", 'null': 'True', 'blank': 'True'}),
            'date_finally_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_first_uploaded': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_upload_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'entry_seq': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '16'}),
            'external_ref': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_number': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'show': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'stmt_or_lg': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'swift': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'trnx_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['postentry.EntryGeneratingTransaction']", 'null': 'True', 'db_column': "'trnx_type'", 'blank': 'True'}),
            'valdate': ('django.db.models.fields.DateField', [], {})
        }
    }

    complete_apps = ['undrawnbal']