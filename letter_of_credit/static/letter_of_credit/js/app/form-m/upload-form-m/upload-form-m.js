"use strict"

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('upload-form-m',
  ['rootApp',
   'ui.router'
  ])

app.config(rootCommons.interpolateProviderConfig)

app.config(uploadFormMURLConfig)
uploadFormMURLConfig.$inject = ['$stateProvider']
function uploadFormMURLConfig($stateProvider) {

  $stateProvider
    .state('form_m.upload', {
      kanmiiTitle: 'Form M Upload',

      views: {
        'uploadFormM': {
          template: require('./upload-form-m.html'),

          controller: 'UploadFormMController as uploadFormM'
        }
      }
    })
}

app.controller('UploadFormMController', UploadFormMController)
UploadFormMController.$inject = []
function UploadFormMController() {
  var vm = this

  vm.uploadFormM = function uploadFormM(text) {
    var formM, row

    function parseDate(dt) {
      return '20' + dt.slice(6) + '-' + dt.slice(3, 5) + '-' + dt.slice(0, 2)
    }

    Papa.parse(text, {
      delimiter: '\t',
      header: false,
      step: function(data) {
        row = data.data[0]

        formM = {
          ba: row[0],
          mf: row[1],
          ccy: row[2],
          applicant: row[3],
          fob: row[5].replace(',', ''),
          submitted_at: parseDate(row[6]),
          validated_at: parseDate(row[7])
        }

        console.log(formM);
      }
    })

    function formMCreatedSuccess(data) {

    }
  }
}
