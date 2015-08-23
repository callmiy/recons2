# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Entry'
        db.create_table('entry', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=2)),
            ('time_created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('time_processed_for_posting', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
            ('date_posted', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
        ))
        db.send_create_signal('postentry', ['Entry'])

        # Adding model 'EntryCode'
        db.create_table('entry_code', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=3)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=80)),
        ))
        db.send_create_signal('postentry', ['EntryCode'])

        # Adding model 'EntryGeneratingTransaction'
        db.create_table('entry_gen_trxn', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('short_name', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('postentry', ['EntryGeneratingTransaction'])

        # Adding model 'EntryContra'
        db.create_table('entry_contra', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('entry', self.gf('django.db.models.fields.related.ForeignKey')(related_name='contras', db_column='entry', to=orm['postentry.Entry'])),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=2)),
            ('account', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.LedgerAccount'], db_column='account')),
            ('code', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['postentry.EntryCode'], db_column='code')),
            ('narration', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('ref', self.gf('django.db.models.fields.CharField')(max_length=16)),
            ('rm_code', self.gf('django.db.models.fields.CharField')(max_length=12, null=True, blank=True)),
            ('entry_gen_trxn', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['postentry.EntryGeneratingTransaction'], db_column='entry_gen_trxn')),
            ('branch_for_itf_int', self.gf('django.db.models.fields.CharField')(max_length=3, null=True, blank=True)),
        ))
        db.send_create_signal('postentry', ['EntryContra'])


    def backwards(self, orm):
        # Deleting model 'Entry'
        db.delete_table('entry')

        # Deleting model 'EntryCode'
        db.delete_table('entry_code')

        # Deleting model 'EntryGeneratingTransaction'
        db.delete_table('entry_gen_trxn')

        # Deleting model 'EntryContra'
        db.delete_table('entry_contra')


    models = {
        'adhocmodels.currency': {
            'Meta': {'ordering': "('code',)", 'object_name': 'Currency', 'db_table': "'currency'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'adhocmodels.ledgeraccount': {
            'Meta': {'object_name': 'LedgerAccount', 'db_table': "'ledger_acct'"},
            'acct_type': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ledger_acct_types'", 'db_column': "'acct_type'", 'to': "orm['adhocmodels.LedgerAccountType']"}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Currency']", 'db_column': "'ccy'"}),
            'external_number': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'lg_numbers'", 'db_column': "'external_number'", 'to_field': "'number'", 'to': "orm['adhocmodels.NostroAccount']", 'blank': 'True', 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_default_memo': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'number': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '60'})
        },
        'adhocmodels.ledgeraccounttype': {
            'Meta': {'ordering': "('code',)", 'object_name': 'LedgerAccountType', 'db_table': "'ledger_acct_type'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        'adhocmodels.nostroaccount': {
            'Meta': {'ordering': "('bank',)", 'object_name': 'NostroAccount', 'db_table': "'nostro_acct'"},
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
        'postentry.entry': {
            'Meta': {'object_name': 'Entry', 'db_table': "'entry'"},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '2'}),
            'date_posted': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'time_created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'time_processed_for_posting': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'})
        },
        'postentry.entrycode': {
            'Meta': {'ordering': "('code',)", 'object_name': 'EntryCode', 'db_table': "'entry_code'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '80'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        'postentry.entrycontra': {
            'Meta': {'object_name': 'EntryContra', 'db_table': "'entry_contra'"},
            'account': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.LedgerAccount']", 'db_column': "'account'"}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '2'}),
            'branch_for_itf_int': ('django.db.models.fields.CharField', [], {'max_length': '3', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['postentry.EntryCode']", 'db_column': "'code'"}),
            'entry': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'contras'", 'db_column': "'entry'", 'to': "orm['postentry.Entry']"}),
            'entry_gen_trxn': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['postentry.EntryGeneratingTransaction']", 'db_column': "'entry_gen_trxn'"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'narration': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ref': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            'rm_code': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True', 'blank': 'True'})
        },
        'postentry.entrygeneratingtransaction': {
            'Meta': {'object_name': 'EntryGeneratingTransaction', 'db_table': "'entry_gen_trxn'"},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['postentry']