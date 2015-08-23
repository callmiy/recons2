# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Branch'
        db.create_table('branch', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=3)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('adhocmodels', ['Branch'])

        # Adding model 'Currency'
        db.create_table('currency', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=3)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('adhocmodels', ['Currency'])

        # Adding model 'OverseasBank'
        db.create_table('overseas_bank', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('swift_bic', self.gf('django.db.models.fields.CharField')(unique=True, max_length=11)),
        ))
        db.send_create_signal('adhocmodels', ['OverseasBank'])

        # Adding model 'RelationshipManager'
        db.create_table('rel_manager', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('rmcode', self.gf('django.db.models.fields.CharField')(unique=True, max_length=15)),
            ('branch', self.gf('django.db.models.fields.related.ForeignKey')(related_name='rel_managers', to=orm['adhocmodels.Branch'])),
        ))
        db.send_create_signal('adhocmodels', ['RelationshipManager'])

        # Adding model 'AccountNumber'
        db.create_table('acct_numb', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nuban', self.gf('django.db.models.fields.CharField')(unique=True, max_length=10)),
            ('old_numb', self.gf('django.db.models.fields.CharField')(max_length=13, null=True, blank=True)),
            ('owner', self.gf('django.db.models.fields.related.ForeignKey')(related_name='my_accts', to=orm['adhocmodels.Customer'])),
            ('branch', self.gf('django.db.models.fields.related.ForeignKey')(related_name='brn_accts', to=orm['adhocmodels.Branch'])),
        ))
        db.send_create_signal('adhocmodels', ['AccountNumber'])

        # Adding model 'RelatedCustomer'
        db.create_table('related_customer', (
            ('me', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['adhocmodels.Customer'], unique=True, primary_key=True)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(related_name='related_customers', to=orm['adhocmodels.Customer'])),
        ))
        db.send_create_signal('adhocmodels', ['RelatedCustomer'])

        # Adding model 'Customer'
        db.create_table('customer', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('rel_manager', self.gf('django.db.models.fields.related.ForeignKey')(related_name='rel_customers', to=orm['adhocmodels.RelationshipManager'])),
            ('branch_for_itf', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Branch'], null=True, blank=True)),
            ('is_parent', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('adhocmodels', ['Customer'])

        # Adding model 'NostroAccount'
        db.create_table('nostro_acct', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('bank', self.gf('django.db.models.fields.related.ForeignKey')(related_name='my_nostros', db_column='bank', to=orm['adhocmodels.OverseasBank'])),
            ('ccy', self.gf('django.db.models.fields.related.ForeignKey')(related_name='ccy_nostros', db_column='ccy', to=orm['adhocmodels.Currency'])),
            ('number', self.gf('django.db.models.fields.CharField')(unique=True, max_length=60)),
        ))
        db.send_create_signal('adhocmodels', ['NostroAccount'])

        # Adding model 'LedgerAccountType'
        db.create_table('ledger_acct_type', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=4)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal('adhocmodels', ['LedgerAccountType'])

        # Adding model 'LedgerAccount'
        db.create_table('ledger_acct', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('number', self.gf('django.db.models.fields.CharField')(unique=True, max_length=60)),
            ('acct_type', self.gf('django.db.models.fields.related.ForeignKey')(related_name='ledger_accts', db_column='acct_type', to=orm['adhocmodels.LedgerAccountType'])),
            ('ccy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Currency'], db_column='ccy')),
            ('external_number', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.NostroAccount'], to_field='number', null=True, db_column='external_number', blank=True)),
            ('is_default_memo', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('adhocmodels', ['LedgerAccount'])

        # Adding model 'ValidTransactionRef'
        db.create_table('valid_refs', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('valid_ref_start', self.gf('django.db.models.fields.CharField')(max_length=16)),
        ))
        db.send_create_signal('adhocmodels', ['ValidTransactionRef'])


    def backwards(self, orm):
        # Deleting model 'Branch'
        db.delete_table('branch')

        # Deleting model 'Currency'
        db.delete_table('currency')

        # Deleting model 'OverseasBank'
        db.delete_table('overseas_bank')

        # Deleting model 'RelationshipManager'
        db.delete_table('rel_manager')

        # Deleting model 'AccountNumber'
        db.delete_table('acct_numb')

        # Deleting model 'RelatedCustomer'
        db.delete_table('related_customer')

        # Deleting model 'Customer'
        db.delete_table('customer')

        # Deleting model 'NostroAccount'
        db.delete_table('nostro_acct')

        # Deleting model 'LedgerAccountType'
        db.delete_table('ledger_acct_type')

        # Deleting model 'LedgerAccount'
        db.delete_table('ledger_acct')

        # Deleting model 'ValidTransactionRef'
        db.delete_table('valid_refs')


    models = {
        'adhocmodels.accountnumber': {
            'Meta': {'ordering': "('owner', 'nuban')", 'object_name': 'AccountNumber', 'db_table': "'acct_numb'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'brn_accts'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nuban': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '10'}),
            'old_numb': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'}),
            'owner': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'my_accts'", 'to': "orm['adhocmodels.Customer']"})
        },
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
            'branch_for_itf': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Branch']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_parent': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rel_manager': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'rel_customers'", 'to': "orm['adhocmodels.RelationshipManager']"})
        },
        'adhocmodels.ledgeraccount': {
            'Meta': {'object_name': 'LedgerAccount', 'db_table': "'ledger_acct'"},
            'acct_type': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ledger_accts'", 'db_column': "'acct_type'", 'to': "orm['adhocmodels.LedgerAccountType']"}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Currency']", 'db_column': "'ccy'"}),
            'external_number': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']", 'to_field': "'number'", 'null': 'True', 'db_column': "'external_number'", 'blank': 'True'}),
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
        'adhocmodels.relatedcustomer': {
            'Meta': {'ordering': "('me', 'parent')", 'object_name': 'RelatedCustomer', 'db_table': "'related_customer'"},
            'me': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['adhocmodels.Customer']", 'unique': 'True', 'primary_key': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'related_customers'", 'to': "orm['adhocmodels.Customer']"})
        },
        'adhocmodels.relationshipmanager': {
            'Meta': {'ordering': "('name', 'rmcode')", 'object_name': 'RelationshipManager', 'db_table': "'rel_manager'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'rel_managers'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rmcode': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15'})
        },
        'adhocmodels.validtransactionref': {
            'Meta': {'object_name': 'ValidTransactionRef', 'db_table': "'valid_refs'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'valid_ref_start': ('django.db.models.fields.CharField', [], {'max_length': '16'})
        }
    }

    complete_apps = ['adhocmodels']