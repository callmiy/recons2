"use strict"

/*jshint camelcase:false*/

require('./search-uploaded-form-m/search-uploaded-form-m.js')

var rootCommons = require('commons')

var app = angular.module('upload-form-m',
  ['rootApp',
    'ui.router',
    'upload-form-m-service',
    'kanmii-underscore'
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
UploadFormMController.$inject = ['UploadFormM', '$timeout', 'kanmiiUnderscore']

function UploadFormMController(UploadFormM, $timeout, kanmiiUnderscore) {
  var vm = this

  initial()
  function initial(form) {
    vm.formMIsUploading = false
    vm.uploadIndicationText = 'Uploading Form Ms.........please wait'
    vm.uploadFormMText = ''

    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  vm.uploadFormM = function uploadFormM(text, uploadFormMForm) {
    vm.formMIsUploading = true

    var uploaded = {}
    var row
    var mf
    var formM
    var ba

    function parseDate(dt) {
      var exec = /(\d{2})\D(\d{1,2})\D(\d{4})/.exec(dt)
      return exec[3] + '-' + exec[1] + '-' + exec[2]
    }

    Papa.parse(text, {
      delimiter: '\t',
      header: true,
      step: function (data) {
        row = data.data[0]
        mf = row['MF NUM'].trim()
        ba = row['BA NUM'].trim()
        formM = {
          ba: ba,
          mf: mf,
          ccy: row.CURRENCY.trim(),
          applicant: row['APPLICANT NAME'].trim(),
          fob: row.FOB.replace(/[,\s]/g, ''),
          cost_freight: row['COST AND FREIGHT'].replace(/[,\s]/g, ''),
          submitted_at: parseDate(row['DATE SUBMITTED']),
          validated_at: parseDate(row['DATE SUBMITTED']),
          goods_description: row.DESCS.trim()
        }

        if (kanmiiUnderscore.has(uploaded, mf)) {
          if (row.STAX.trim() === 'Validated') {
            formM.submitted_at = uploaded[mf].submitted_at
            uploaded[mf] = formM

          } else if (row.STAX.trim() === 'Submitted') uploaded[mf].submitted_at = formM.submitted_at

        } else {
          if (ba.length === 16) uploaded[mf] = formM
        }
      }
    })

    UploadFormM.save({uploaded: kanmiiUnderscore.values(uploaded), likely_duplicates: true})
      .$promise.then(formMCreatedSuccess, formMCreatedError)

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

      $timeout(function () {
        initial(uploadFormMForm)
      }, 4500)
    }

    function formMCreatedError(xhr) {
      vm.uploadIndicationText = 'Error uploading form!'
      console.log(xhr);
    }
  }
}
