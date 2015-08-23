# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import DataMigration
from django.db import models

class Migration(DataMigration):

    def forwards(self, orm):
        "Write your forwards methods here."
        # Note: Don't use "from appname.models import ModelName".
        # Use orm.ModelName to refer to models in this application,
        # and orm['appname.ModelName'] for models in other applications.
        from django.db.models import connection

        cursor = connection.cursor()
        cursor.execute('select external_number from ledger_acct where external_number is not null')

        for number in [el[0] for el in cursor.fetchall()]:
            if len(str(number)) > 2:
                try:
                    external_number_id = orm.NostroAccount.objects.get(number=number).id
                    cursor.execute(
                        'update ledger_acct set external_number = %s where external_number = %s', (
                            external_number_id, number))
                except:
                    try:
                        # for fields that contain numbers with leading zero, sqlite3 truncates the
                        # leading zero where outputting the value of the field (or may be it's my
                        # output device that does the truncating). But somehow django retrieves
                        # value of the field with the leading zero. So I restore the leading zero
                        # leading zero.
                        numberx = '0%s' % number
                        external_number_id = orm.NostroAccount.objects.get(number=numberx).id
                        cursor.execute(
                            'update ledger_acct set external_number = %s where external_number = %s', (
                                external_number_id, number))
                    except:
                        pass

    def backwards(self, orm):
        "Write your backwards methods here."

    models = {
        'adhocmodels.accountnumber': {
            'Meta': {'ordering': "('owner', 'nuban')", 'object_name': 'AccountNumber', 'db_table': "'acct_numb'"},
            'acct_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '10'}),
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
        u'adhocmodels.currency': {
            'Meta': {'object_name': 'Currency', 'db_table': "'currency'"},
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
        'adhocmodels.ledgeraccount': {
            'Meta': {'object_name': 'LedgerAccount', 'db_table': "'ledger_acct'"},
            'acct_type': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ledger_acct_types'", 'db_column': "'acct_type'", 'to': "orm['adhocmodels.LedgerAccountType']"}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['adhocmodels.Currency']", 'db_column': "'ccy'"}),
            'external_number': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'lg_numbers'", 'null': 'True', 'db_column': "'external_number'", 'to': u"orm['adhocmodels.NostroAccount']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_default_memo': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '60'})
        },
        'adhocmodels.ledgeraccounttype': {
            'Meta': {'ordering': "('code',)", 'object_name': 'LedgerAccountType', 'db_table': "'ledger_acct_type'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'adhocmodels.nostroaccount': {
            'Meta': {'unique_together': "(('bank', 'ccy', 'number'),)", 'object_name': 'NostroAccount', 'db_table': "'nostro_acct'"},
            'bank': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'my_nostros'", 'db_column': "'bank'", 'to': "orm['adhocmodels.OverseasBank']"}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ccy_nostros'", 'db_column': "'ccy'", 'to': u"orm['adhocmodels.Currency']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
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
        'adhocmodels.validtransactionref': {
            'Meta': {'object_name': 'ValidTransactionRef', 'db_table': "'valid_refs'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'valid_ref_start': ('django.db.models.fields.CharField', [], {'max_length': '16'})
        }
    }

    complete_apps = ['adhocmodels']
    symmetrical = True
