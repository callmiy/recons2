"use strict"

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('upload-form-m',
  ['rootApp',
   'ui.router',
   'upload-form-m-service'
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

UploadFormMController.$inject = ['UploadFormM', '$timeout']

function UploadFormMController(UploadFormM, $timeout) {
  var vm = this

  initial()
  function initial() {
    vm.formMIsUploading = false
    vm.uploadIndicationText = 'Uploading Form Ms.........please wait'
    vm.uploadFormMText = ''
  }

  vm.uploadFormM = function uploadFormM(text) {
    vm.formMIsUploading = true

    var uploaded = [],
      row

    function parseDate(dt) {
      return '20' + dt.slice(6) + '-' + dt.slice(3, 5) + '-' + dt.slice(0, 2)
    }

    Papa.parse(text, {
      delimiter: '\t',
      header: false,
      step: function(data) {
        row = data.data[0]

        uploaded.push({
          ba: row[0],
          mf: row[1],
          ccy: row[2],
          applicant: row[3],
          fob: row[5].replace(/,/g, ''),
          submitted_at: parseDate(row[6]),
          validated_at: parseDate(row[7])
        })
      }
    })

    UploadFormM.save({
      uploaded: uploaded,
      likely_duplicates: true
    })
      .$promise
      .then(formMCreatedSuccess, formMCreatedError)

    function formMCreatedSuccess(data) {
      var creationResult = data.created_data,
        numCreatedNow = creationResult.length,
        numCreatedPreviously = uploaded.length - numCreatedNow

      vm.uploadIndicationText = 'Done Upload form Ms\n' +
                                '=========================\n' +
                                'Total new form Ms created: ' + numCreatedNow + '\n'
      if (numCreatedPreviously) {
        vm.uploadIndicationText += ('Total not created (because uploaded previously): ' + numCreatedPreviously)
      }

      $timeout(function() {
        initial()
      }, 4500)
    }

    function formMCreatedError(xhr) {
      console.log(xhr);
    }
  }
}
