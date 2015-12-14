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
UploadFormMController.$inject = ['UploadFormM', 'xhrErrorDisplay', 'kanmiiUnderscore', '$scope']

function UploadFormMController(UploadFormM, xhrErrorDisplay, kanmiiUnderscore, $scope) {
  var vm = this
  vm.datePrompt = 'Date must be in format dd-mm-yyyy e.g 31-01-2015'

  initial()
  function initial(form) {
    vm.formMShowIndicator = false
    vm.indicateError = false
    vm.formMIsUploading = false
    vm.uploadIndicationText = 'Uploading Form Ms.........please wait'
    vm.uploadFormMText = ''

    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  function doDismiss() {
    vm.formMShowIndicator = false
    if (vm.formMIsUploading) initial($scope.uploadFormMForm)
  }

  vm.dismissIndicator = function dismissIndicator() {
    doDismiss()
  }

  vm.dismissIndicatorEvent = function dismissIndicatorEvent($event) {
    console.log($event)
    if ($event && $event.keyCode === 27) doDismiss()
  }

  vm.uploadFormM = function uploadFormM(text) {
    vm.formMIsUploading = true
    vm.formMShowIndicator = true
    var uploaded = {}
    var row
    var mf
    var formM
    var ba
    var dt

    function parseDate(dt) {
      var regExp = /(\d{2})\D(\d{1,2})\D(\d{4})/
      var exec = regExp.exec(dt)

      if (!exec) return null

      var month = +exec[2].trim()

      if (month > 12) return null

      return exec[3] + '-' + month + '-' + exec[1]
    }

    try {
      Papa.parse(text, {
        delimiter: '\t',
        header: true,
        step: function (data) {
          row = data.data[0]
          mf = row['MF NUM'].trim()
          ba = row['BA NUM'].trim()
          dt = parseDate(row['DATE SUBMITTED'])

          if (!dt) throw new Error('Error in form M date: "' + mf + '"\n' + vm.datePrompt)

          formM = {
            ba: ba,
            mf: mf,
            ccy: row.CURRENCY.trim(),
            applicant: row['APPLICANT NAME'].trim(),
            fob: row.FOB.replace(/[,\s]/g, ''),
            cost_freight: row['COST AND FREIGHT'].replace(/[,\s]/g, ''),
            submitted_at: dt,
            validated_at: dt,
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
    } catch (e) {
      vm.formMIsUploading = false
      vm.indicateError = true
      vm.uploadIndicationText = e.message
      return
    }

    var uploaded1 = kanmiiUnderscore.values(uploaded)
    UploadFormM.save({uploaded: uploaded1, likely_duplicates: true})
      .$promise.then(formMCreatedSuccess, formMCreatedError)

    function formMCreatedSuccess(data) {
      var creationResult = data.created_data,
        numCreatedNow = creationResult.length,
        numCreatedPreviously = uploaded1.length - numCreatedNow

      vm.uploadIndicationText = 'Done Uploading form Ms\n======================\n' +
        'Total new form Ms created: ' + numCreatedNow + '\n'
      if (numCreatedPreviously) {
        vm.uploadIndicationText += ('Total not created (uploaded previously): ' + numCreatedPreviously)
      }
    }

    function formMCreatedError(xhr) {
      vm.formMIsUploading = false
      vm.indicateError = true
      vm.uploadIndicationText = 'Error uploading form!'
      xhrErrorDisplay(xhr)
    }
  }
}
