"use strict";

/*jshint camelcase:false*/

require('./form-m-object.js')
require('./lc-issue/lc-issue.js')
require('./lc-cover/lc-cover.js')
require('./lc-bid/lc-bid.js')
require('./comment/comment.js')

var app = angular.module('add-form-m', [
  'ui.router',
  'rootApp',
  'kanmii-underscore',
  'customer',
  'search-detailed-or-uploaded-form-m',
  'form-m-service',
  'lc-cover',
  'lc-issue',
  'lc-bid',
  'form-m-comment',
  'lc-bid-request',
  'confirmation-dialog',
  'add-form-m-form-m-object'
])

app.config(formMStateConfig)

formMStateConfig.$inject = ['$stateProvider']

function formMStateConfig($stateProvider) {
  $stateProvider
    .state('form_m.add', {
      kanmiiTitle: 'Add form M',

      params: {detailedFormM: null, showSummary: null},

      views: {
        addFormM: {
          templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m/add-form-m.html'),

          controller: 'AddFormMStateController as addFormMState'
        }
      }
    })
}

app.controller('AddFormMStateController', AddFormMStateController)

AddFormMStateController.$inject = [
  'getTypeAheadCustomer',
  'getTypeAheadCurrency',
  'SearchDetailedOrUploadedFormMService',
  'kanmiiUnderscore',
  'xhrErrorDisplay',
  '$stateParams',
  'resetForm2',
  '$state',
  '$scope',
  'confirmationDialog',
  'formMObject'
]

function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
  kanmiiUnderscore, xhrErrorDisplay, $stateParams, resetForm2,
  $state, $scope, confirmationDialog, formMObject) {
  var vm = this

  //1. fix summary for issues when form M saved

  vm.detailedFormM = angular.copy($stateParams.detailedFormM)
  $stateParams.detailedFormM = null

  initialize()
  function initialize(form) {
    formMObject.init(vm.detailedFormM, function (formM) {
      vm.formM = formM

      if (vm.formM.number) {
        $scope.updateAddFormMTitle(formM)
        vm.fieldIsEditable = {
          number: false,
          currency: false,
          applicant: false,
          date_received: false,
          amount: false
        }

      } else {
        $scope.updateAddFormMTitle()
        vm.fieldIsEditable = {
          number: true,
          currency: true,
          applicant: true,
          date_received: true,
          amount: true
        }
      }
    })

    vm.searchFormM = {}
    formMSavedSuccessMessage()

    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  function formMSavedSuccessMessage() {
    var summary = $stateParams.showSummary
    $stateParams.showSummary = null

    if (summary) {
      confirmationDialog.showDialog({
        title: '"' + vm.formM.number + '" successfully saved',
        text: summary,
        infoOnly: true
      })
    }
  }

  vm.enableFieldEdit = function enableFieldEdit(field) {
    vm.fieldIsEditable[field] = vm.detailedFormM ? !vm.fieldIsEditable[field] : false
  }

  vm.validators = {
    applicant: {
      test: function () {
        return kanmiiUnderscore.isObject(vm.formM.applicant)
      }
    },

    currency: {
      test: function () {
        return kanmiiUnderscore.isObject(vm.formM.currency)
      }
    }
  }

  vm.disableSubmitBtn = disableSubmitBtn
  function disableSubmitBtn() {
    if ($scope.newFormMForm.$invalid) return true

    if (kanmiiUnderscore.has(vm.formM.coverForm, '$invalid') && vm.formM.coverForm.$invalid) return true

    if (kanmiiUnderscore.has(vm.formM.bidForm, '$invalid') && vm.formM.bidForm.$invalid) return true

    if (kanmiiUnderscore.has(vm.formM.issuesForm, '$invalid') && vm.formM.issuesForm.$invalid) return true

    if (formMObject.showEditBid) return true

    var compared = formMObject.compareFormMs(vm.detailedFormM)

    if (!compared) return false

    if (kanmiiUnderscore.all(compared)) {
      if (formMObject.bid.goods_description && formMObject.bid.amount) return false
      if (!kanmiiUnderscore.isEmpty(vm.formM.cover)) return false
      return !vm.formM.selectedIssues.length
    }

    return false
  }

  vm.reset = reset
  function reset(addFormMForm) {
    vm.detailedFormM = null

    resetForm2(addFormMForm, [
      {
        form: $scope.newFormMForm, elements: ['applicant', 'currency']
      }
    ])

    initialize()
  }

  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency

  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.datePickerIsOpen = false
  vm.openDatePicker = function openDatePicker() {
    vm.datePickerIsOpen = true
  }

  vm.getUploadedFormM = function getUploadedFormM() {
    vm.detailedFormM = null
    initialize()

    SearchDetailedOrUploadedFormMService.searchWithModal().then(function (data) {
      if (data.detailed) {
        vm.detailedFormM = data.detailed
        initialize()

      } else {
        var formM = data.uploaded
        vm.searchFormM = formM
        vm.formM.number = formM.mf
        vm.formM.amount = formM.cost_freight
        vm.formM.goods_description = formM.goods_description

        getTypeAheadCurrency(formM.ccy).then(function (ccy) {
          vm.formM.currency = ccy[0]
        })
      }
    })
  }

  vm.submit = function submit(formM) {
    formMObject.saveFormM(formM, vm.detailedFormM).then(function saveFormMSuccess(data) {
      $state.go('form_m.add', data)

    }, function saveFormMError(xhr) {
      xhrErrorDisplay(xhr)
    })
  }
}
