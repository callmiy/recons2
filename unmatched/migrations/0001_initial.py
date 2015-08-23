# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UnmatchedRecons'
        db.create_table('unmatched_recons', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('valdate', self.gf('django.db.models.fields.DateField')()),
            ('entry_seq', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=16, decimal_places=2)),
            ('lc_number', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('external_ref', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('stmt_or_lg', self.gf('django.db.models.fields.CharField')(max_length=4)),
            ('acct_numb', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.NostroAccount'], db_column='acct_numb')),
            ('trnx_type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['postentry.EntryGeneratingTransaction'], null=True, db_column='trnx_type', blank=True)),
            ('date_first_uploaded', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('date_upload_processed', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('date_finally_processed', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('show', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('customer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Customer'], null=True, blank=True)),
            ('comment', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('swift', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('clarec_details', self.gf('django.db.models.fields.CharField')(max_length=2000, null=True, blank=True)),
        ))
        db.send_create_signal(u'unmatched', ['UnmatchedRecons'])

        # Adding model 'UnmatchedClarec'
        db.create_table('clirec', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('post_date', self.gf('django.db.models.fields.DateField')()),
            ('valdate', self.gf('django.db.models.fields.DateField')()),
            ('details', self.gf('django.db.models.fields.CharField')(max_length=1000)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('lc_number', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('nostro', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.NostroAccount'])),
            ('swift_flex', self.gf('django.db.models.fields.CharField')(max_length=4)),
            ('dr_cr', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('show', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('date_first_uploaded', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('comment', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('date_upload_processed', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('uploaded_b4_id', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'unmatched', ['UnmatchedClarec'])

        # Adding unique constraint on 'UnmatchedClarec', fields ['post_date', 'valdate', 'details', 'amount', 'nostro', 'swift_flex', 'dr_cr']
        db.create_unique('clirec', ['post_date', 'valdate', 'details', 'amount', 'nostro_id', 'swift_flex', 'dr_cr'])


    def backwards(self, orm):
        # Removing unique constraint on 'UnmatchedClarec', fields ['post_date', 'valdate', 'details', 'amount', 'nostro', 'swift_flex', 'dr_cr']
        db.delete_unique('clirec', ['post_date', 'valdate', 'details', 'amount', 'nostro_id', 'swift_flex', 'dr_cr'])

        # Deleting model 'UnmatchedRecons'
        db.delete_table('unmatched_recons')

        # Deleting model 'UnmatchedClarec'
        db.delete_table('clirec')


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
        u'unmatched.unmatchedclarec': {
            'Meta': {'unique_together': "(('post_date', 'valdate', 'details', 'amount', 'nostro', 'swift_flex', 'dr_cr'),)", 'object_name': 'UnmatchedClarec', 'db_table': "'clirec'"},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'date_first_uploaded': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_upload_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'details': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'dr_cr': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_number': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'nostro': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']"}),
            'post_date': ('django.db.models.fields.DateField', [], {}),
            'show': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'swift_flex': ('django.db.models.fields.CharField', [], {'max_length': '4'}),
            'uploaded_b4_id': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'valdate': ('django.db.models.fields.DateField', [], {})
        },
        u'unmatched.unmatchedrecons': {
            'Meta': {'object_name': 'UnmatchedRecons', 'db_table': "'unmatched_recons'"},
            'acct_numb': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']", 'db_column': "'acct_numb'"}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '16', 'decimal_places': '2'}),
            'clarec_details': ('django.db.models.fields.CharField', [], {'max_length': '2000', 'null': 'True', 'blank': 'True'}),
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']", 'null': 'True', 'blank': 'True'}),
            'date_finally_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'date_first_uploaded': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_upload_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'entry_seq': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
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

    complete_apps = ['unmatched']