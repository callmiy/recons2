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
        for chg in orm.Charge.objects.filter(entry_seq__isnull=False):
            unmatched = orm['unmatched.UnmatchedRecons'].objects.filter(
                entry_seq=chg.entry_seq)
            if unmatched.exists():
                chg.unmatched = unmatched[0]
                chg.save()

    def backwards(self, orm):
        "Write your backwards methods here."
        raise RuntimeError("Backward migration not allowed!")

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
            'unmatched': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'unmatched_chgs'", 'null': 'True', 'to': "orm['unmatched.UnmatchedRecons']"}),
            'val_date_adv': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'val_date_dr': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'})
        },
        'postentry.entrygeneratingtransaction': {
            'Meta': {'object_name': 'EntryGeneratingTransaction', 'db_table': "'entry_gen_trxn'"},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        },
        'unmatched.unmatchedrecons': {
            'Meta': {'ordering': "('valdate',)", 'object_name': 'UnmatchedRecons', 'db_table': "'unmatched_recons'"},
            'acct_numb': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.NostroAccount']", 'db_column': "'acct_numb'"}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '16', 'decimal_places': '2'}),
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']", 'null': 'True', 'blank': 'True'}),
            'date_first_uploaded': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'date_processed': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
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

    complete_apps = ['chgs']
    symmetrical = True
