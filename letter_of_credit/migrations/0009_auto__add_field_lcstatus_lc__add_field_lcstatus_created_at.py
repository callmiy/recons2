# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Removing M2M table for field statuses on 'LetterOfCredit'
        db.delete_table(db.shorten_name('letter_of_credit_statuses'))

        # Adding field 'LcStatus.lc'
        db.add_column('lc_status', 'lc',
                      self.gf('django.db.models.fields.related.ForeignKey')(default='', related_name='statuses', to=orm['letter_of_credit.LetterOfCredit']),
                      keep_default=False)

        # Adding field 'LcStatus.created_at'
        db.add_column('lc_status', 'created_at',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, default=datetime.datetime(2014, 11, 23, 0, 0), blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding M2M table for field statuses on 'LetterOfCredit'
        m2m_table_name = db.shorten_name('letter_of_credit_statuses')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('letterofcredit', models.ForeignKey(orm[u'letter_of_credit.letterofcredit'], null=False)),
            ('lcstatus', models.ForeignKey(orm[u'letter_of_credit.lcstatus'], null=False))
        ))
        db.create_unique(m2m_table_name, ['letterofcredit_id', 'lcstatus_id'])

        # Deleting field 'LcStatus.lc'
        db.delete_column('lc_status', 'lc_id')

        # Deleting field 'LcStatus.created_at'
        db.delete_column('lc_status', 'created_at')


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
        u'letter_of_credit.lcstatus': {
            'Meta': {'object_name': 'LcStatus', 'db_table': "'lc_status'"},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lc': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'statuses'", 'to': u"orm['letter_of_credit.LetterOfCredit']"}),
            'text': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '256'})
        },
        u'letter_of_credit.letterofcredit': {
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