# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'LCClass'
        db.create_table('lc_class', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('prod_code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=4)),
            ('desc', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'contingent_report', ['LCClass'])

        # Adding model 'TIPostingStatusReport'
        db.create_table('ti_posting_status_report', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('ref', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('posting_date', self.gf('django.db.models.fields.DateField')()),
            ('acct_number', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('ccy', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('amount', self.gf('django.db.models.fields.DecimalField')(max_digits=100, decimal_places=2)),
            ('narration', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('applicant', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('success', self.gf('django.db.models.fields.CharField')(max_length=7)),
            ('mf', self.gf('django.db.models.fields.CharField')(max_length=13, null=True, blank=True)),
            ('ba', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
            ('comment', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'contingent_report', ['TIPostingStatusReport'])

        # Adding model 'TIFlexRecons'
        db.create_table('ti_flex', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('brn_code', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('brn_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('flex_ref', self.gf('django.db.models.fields.CharField')(max_length=16)),
            ('ti_ref', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('acct_numb', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('acct_name', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('ccy', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('dr_cr', self.gf('django.db.models.fields.CharField')(max_length=1)),
            ('fcy_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('lcy_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=20, decimal_places=2)),
            ('val_date', self.gf('django.db.models.fields.DateField')()),
            ('narration', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'contingent_report', ['TIFlexRecons'])

        # Adding model 'ContingentAccount'
        db.create_table('contingent_acct', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('gl_code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50)),
            ('ccy', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('in_use', self.gf('django.db.models.fields.NullBooleanField')(default=None, null=True, blank=True)),
            ('acct_class', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
        ))
        db.send_create_signal(u'contingent_report', ['ContingentAccount'])

        # Adding model 'ContingentReport'
        db.create_table('contingent_report', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('flex_ref', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('ti_ref', self.gf('django.db.models.fields.CharField')(max_length=16, null=True, blank=True)),
            ('flex_module', self.gf('django.db.models.fields.CharField')(max_length=2)),
            ('gl_code', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('acct_numb', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='entries', null=True, to=orm['contingent_report.ContingentAccount'])),
            ('customer_name', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('booking_date', self.gf('django.db.models.fields.DateField')()),
            ('liq_date', self.gf('django.db.models.fields.DateField')()),
            ('ccy', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('fx_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=100, decimal_places=2)),
            ('ngn_amt', self.gf('django.db.models.fields.DecimalField')(max_digits=100, decimal_places=2)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='members', null=True, db_column='parent', to=orm['contingent_report.ContingentReport'])),
            ('ispar', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('narration', self.gf('django.db.models.fields.CharField')(max_length=300, null=True, blank=True)),
        ))
        db.send_create_signal(u'contingent_report', ['ContingentReport'])


    def backwards(self, orm):
        # Deleting model 'LCRegister'
        db.delete_table('lc_register')

        # Deleting model 'LCClass'
        db.delete_table('lc_class')

        # Deleting model 'TIPostingStatusReport'
        db.delete_table('ti_posting_status_report')

        # Deleting model 'TIFlexRecons'
        db.delete_table('ti_flex')

        # Deleting model 'ContingentAccount'
        db.delete_table('contingent_acct')

        # Deleting model 'ContingentReport'
        db.delete_table('contingent_report')


    models = {
        u'adhocmodels.currency': {
            'Meta': {'object_name': 'Currency', 'db_table': "'currency'"},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '3'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
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
