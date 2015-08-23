# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'LCRegister'
        db.delete_table('lc_register')


    def backwards(self, orm):
        # Adding model 'LCRegister'
        db.create_table('lc_register', (
            ('lc_number', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('brn_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('lc_amt_usd', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=100, decimal_places=2, blank=True)),
            ('acct_numb', self.gf('django.db.models.fields.CharField')(max_length=13, null=True, blank=True)),
            ('bene', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('lc_amt_org_ccy', self.gf('django.db.models.fields.DecimalField')(max_digits=100, decimal_places=2)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('ccy_obj', self.gf('django.db.models.fields.related.ForeignKey')(related_name='lc_reg_ccy', to=orm['adhocmodels.Currency'])),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('post_status', self.gf('django.db.models.fields.related.ForeignKey')(related_name='lc_reg', null=True, to=orm['contingent_report.TIPostingStatusReport'], blank=True)),
            ('port', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('estb_date', self.gf('django.db.models.fields.DateField')()),
            ('confirmation', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('ba', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('expiry_date', self.gf('django.db.models.fields.DateField')()),
            ('address', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('brn_code', self.gf('django.db.models.fields.CharField')(max_length=3, null=True, blank=True)),
            ('bene_country', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('mf', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('ccy', self.gf('django.db.models.fields.CharField')(max_length=3, null=True, blank=True)),
            ('supply_country', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('applicant', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('advising_bank', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('lc_class', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal(u'contingent_report', ['LCRegister'])


    models = {
        u'contingent_report.contingentaccount': {
            'Meta': {'ordering': "('ccy',)", 'object_name': 'ContingentAccount', 'db_table': "'contingent_acct'"},
            'acct_class': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'ccy': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'gl_code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'in_use': ('django.db.models.fields.NullBooleanField', [], {'default': 'None', 'null': 'True', 'blank': 'True'})
        },
        u'contingent_report.contingentreport': {
            'Meta': {'ordering': "('-booking_date',)", 'object_name': 'ContingentReport', 'db_table': "'contingent_report'"},
            'acct_numb': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'entries'", 'null': 'True', 'to': u"orm['contingent_report.ContingentAccount']"}),
            'booking_date': ('django.db.models.fields.DateField', [], {}),
            'ccy': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'customer_name': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'flex_module': ('django.db.models.fields.CharField', [], {'max_length': '2'}),
            'flex_ref': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'fx_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '100', 'decimal_places': '2'}),
            'gl_code': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ispar': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'liq_date': ('django.db.models.fields.DateField', [], {}),
            'narration': ('django.db.models.fields.CharField', [], {'max_length': '300', 'null': 'True', 'blank': 'True'}),
            'ngn_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '100', 'decimal_places': '2'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'members'", 'null': 'True', 'db_column': "'parent'", 'to': u"orm['contingent_report.ContingentReport']"}),
            'ti_ref': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'})
        },
        u'contingent_report.lcclass': {
            'Meta': {'object_name': 'LCClass', 'db_table': "'lc_class'"},
            'desc': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'prod_code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'})
        },
        u'contingent_report.tiflexrecons': {
            'Meta': {'ordering': "('-val_date',)", 'object_name': 'TIFlexRecons', 'db_table': "'ti_flex'"},
            'acct_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'acct_numb': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'brn_code': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'brn_name': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'ccy': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'dr_cr': ('django.db.models.fields.CharField', [], {'max_length': '1'}),
            'fcy_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'flex_ref': ('django.db.models.fields.CharField', [], {'max_length': '16'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lcy_amt': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'narration': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'ti_ref': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'val_date': ('django.db.models.fields.DateField', [], {})
        },
        u'contingent_report.tipostingstatusreport': {
            'Meta': {'ordering': "('-posting_date',)", 'object_name': 'TIPostingStatusReport', 'db_table': "'ti_posting_status_report'"},
            'acct_number': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '100', 'decimal_places': '2'}),
            'applicant': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'ba': ('django.db.models.fields.CharField', [], {'max_length': '16', 'null': 'True', 'blank': 'True'}),
            'ccy': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mf': ('django.db.models.fields.CharField', [], {'max_length': '13', 'null': 'True', 'blank': 'True'}),
            'narration': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'posting_date': ('django.db.models.fields.DateField', [], {}),
            'ref': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'success': ('django.db.models.fields.CharField', [], {'max_length': '7'})
        }
    }

    complete_apps = ['contingent_report']