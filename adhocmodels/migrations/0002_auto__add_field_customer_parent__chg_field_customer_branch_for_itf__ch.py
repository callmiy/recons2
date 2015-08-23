# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Customer.parent'
        db.add_column('customer', 'parent',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='subsidiaries', null=True, db_column='parent', to=orm['adhocmodels.Customer']),
                      keep_default=False)


        # Renaming column for 'Customer.branch_for_itf' to match new field type.
        db.rename_column('customer', 'branch_for_itf_id', 'brn_itf')
        # Changing field 'Customer.branch_for_itf'
        db.alter_column('customer', 'brn_itf', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Branch'], null=True, db_column='brn_itf'))

        # Changing field 'Customer.name'
        db.alter_column('customer', 'name', self.gf('django.db.models.fields.CharField')(max_length=200))

        # Renaming column for 'Customer.rel_manager' to match new field type.
        db.rename_column('customer', 'rel_manager_id', 'rel_manager')
        # Changing field 'Customer.rel_manager'
        db.alter_column(
            'customer',
            'rel_manager',
            self.gf('django.db.models.fields.related.ForeignKey')(
                null=True,
                db_column='rel_manager',
                to=orm['adhocmodels.RelationshipManager']))

    def backwards(self, orm):
        # Deleting field 'Customer.parent'
        db.delete_column('customer', 'parent')


        # Renaming column for 'Customer.branch_for_itf' to match new field type.
        db.rename_column('customer', 'brn_itf', 'branch_for_itf_id')
        # Changing field 'Customer.branch_for_itf'
        db.alter_column('customer', 'branch_for_itf_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['adhocmodels.Branch'], null=True))

        # Changing field 'Customer.name'
        db.alter_column('customer', 'name', self.gf('django.db.models.fields.CharField')(max_length=50))

        # User chose to not deal with backwards NULL issues for 'Customer.rel_manager'
        # raise RuntimeError("Cannot reverse this migration. 'Customer.rel_manager' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Renaming column for 'Customer.rel_manager' to match new field type.
        db.rename_column('customer', 'rel_manager', 'rel_manager_id')
        # Changing field 'Customer.rel_manager'
        db.alter_column(
            'customer',
            'rel_manager_id',
            self.gf('django.db.models.fields.related.ForeignKey')(
                null=True,
                to=orm['adhocmodels.RelationshipManager']))

    models = {
        'adhocmodels.accountnumber': {
            'Meta': {'ordering': "('owner', 'nuban')", 'object_name': 'AccountNumber', 'db_table': "'acct_numb'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'accts'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nuban': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '10'}),
            'old_numb': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'}),
            'owner': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'acct_numbs'", 'to': "orm['adhocmodels.Customer']"})
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
            'branch_for_itf': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Branch']", 'null': 'True', 'db_column': "'brn_itf'", 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_parent': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'subsidiaries'", 'null': 'True', 'db_column': "'parent'", 'to': "orm['adhocmodels.Customer']"}),
            'rel_manager': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'clients'", 'null': 'True', 'db_column': "'rel_manager'", 'to': "orm['adhocmodels.RelationshipManager']"})
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