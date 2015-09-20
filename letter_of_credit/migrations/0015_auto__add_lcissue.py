# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'LCIssue'
        db.create_table('lc_issue', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('text', self.gf('django.db.models.fields.CharField')(max_length=300)),
        ))
        db.send_create_signal('letter_of_credit', ['LCIssue'])


    def backwards(self, orm):
        # Deleting model 'LCIssue'
        db.delete_table('lc_issue')


    models = {
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
        'adhocmodels.relationshipmanager': {
            'Meta': {'ordering': "('name', 'rmcode')", 'object_name': 'RelationshipManager', 'db_table': "'rel_manager'"},
            'branch': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'rel_managers'", 'to': "orm['adhocmodels.Branch']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'rmcode': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '15'})
        },
        'letter_of_credit.formm': {
            'Meta': {'object_name': 'FormM', 'db_table': "'form_m'"},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'applicant': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']"}),
            'currency': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['adhocmodels.Currency']"}),
            'date_received': ('django.db.models.fields.DateField', [], {}),
            'goods_description': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['letter_of_credit.LCRegister']", 'null': 'True', 'blank': 'True'}),
            'number': ('django.db.models.fields.CharField', [], {'max_length': '13'})
        },
        'letter_of_credit.lcissue': {
            'Meta': {'object_name': 'LCIssue', 'db_table': "'lc_issue'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '300'})
        },
        'letter_of_credit.lcregister': {
            'Meta': {'ordering': "('-estb_date',)", 'object_name': 'LCRegister', 'db_table': "'lc_register'"},
            'acct_numb': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'}),
            'address': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'advising_bank': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'applicant': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'applicant_obj': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'lc_register_obj'", 'null': 'True', 'to': "orm['adhocmodels.Customer']"}),
            'ba': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'bene': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'bene_country': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'brn_code': ('django.db.models.fields.CharField', [], {'max_length': '3', 'null': 'True', 'blank': 'True'}),
            'brn_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'brn_obj': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Branch']", 'null': 'True', 'blank': 'True'}),
            'ccy': ('django.db.models.fields.CharField', [], {'max_length': '3', 'null': 'True', 'blank': 'True'}),
            'ccy_obj': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'lc_reg_ccy'", 'to': u"orm['adhocmodels.Currency']"}),
            'confirmation': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'date_started': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'estb_date': ('django.db.models.fields.DateField', [], {}),
            'expiry_date': ('django.db.models.fields.DateField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_amt_org_ccy': ('django.db.models.fields.DecimalField', [], {'max_digits': '100', 'decimal_places': '2'}),
            'lc_amt_usd': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '100', 'decimal_places': '2', 'blank': 'True'}),
            'lc_class': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'lc_number': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'mf': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'port': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'sector': ('django.db.models.fields.CharField', [], {'max_length': '11', 'null': 'True', 'blank': 'True'}),
            'supply_country': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'})
        },
        'letter_of_credit.lcstatus': {
            'Meta': {'object_name': 'LcStatus', 'db_table': "'lc_status'"},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'statuses'", 'to': "orm['letter_of_credit.LetterOfCredit']"}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '256'})
        },
        'letter_of_credit.letterofcredit': {
            'Meta': {'object_name': 'LetterOfCredit', 'db_table': "'letter_of_credit'"},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '14', 'decimal_places': '2'}),
            'applicant': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['adhocmodels.Customer']"}),
            'bid_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'ccy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['adhocmodels.Currency']"}),
            'date_released': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'date_started': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc_ref': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True'}),
            'mf': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True'}),
            'ti_mf': ('django.db.models.fields.CharField', [], {'max_length': '12', 'null': 'True'})
        }
    }

    complete_apps = ['letter_of_credit']