"use strict";

/*jshint camelcase:false*/

require('./form-m-object.js')
require('./lc-issue/lc-issue.js')
require('./lc-cover/lc-cover.js')

var app = angular.module('add-form-m', [
  'ui.router',
  'rootApp',
  'kanmii-underscore',
  'customer',
  'search-detailed-or-uploaded-form-m',
  'form-m-service',
  'lc-cover',
  'lc-issue',
  'lc-bid-request',
  'confirmation-dialog',
  'add-form-m-form-m-object'
])

app.config(formMStateURLConfig)

formMStateURLConfig.$inject = ['$stateProvider']

function formMStateURLConfig($stateProvider) {
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
  'formatDate',
  'xhrErrorDisplay',
  'formMAttributesVerboseNames',
  'FormM',
  '$filter',
  '$stateParams',
  'resetForm2',
  '$state',
  '$scope',
  'confirmationDialog',
  'formMObject'
]

function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
  kanmiiUnderscore, formatDate, xhrErrorDisplay, formMAttributesVerboseNames, FormM, $filter, $stateParams, resetForm2,
  $state, $scope, confirmationDialog, formMObject) {
  var vm = this

  vm.detailedFormM = angular.copy($stateParams.detailedFormM)
  $stateParams.detailedFormM = null

  /*
   *@param {angular.form} the HTML fieldSet element for form M cover
   */
  var coverForm

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

    /*
     *@param {angular.form.model} the form M cover model
     */
    vm.cover = null

    vm.bid = formMObject.bidObj
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

  vm.onCoverChanged = function onCoverChanged(cover, form) {
    vm.cover = cover
    coverForm = form
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

    if (coverForm && coverForm.$invalid) return true

    if (kanmiiUnderscore.has(vm.formM.bidForm, '$invalid') && vm.formM.bidForm.$invalid) return true

    if (kanmiiUnderscore.has(vm.formM.issuesForm, '$invalid') && vm.formM.issuesForm.$invalid) return true

    if (vm.showEditBid) return true

    var compared = compareDetailedFormMWithForm()

    if (!compared) return false

    if (kanmiiUnderscore.all(compared)) {
      if (!kanmiiUnderscore.isEmpty(vm.bid) && vm.bid.goods_description && vm.bid.amount) return false
      if (vm.cover && !kanmiiUnderscore.isEmpty(vm.cover)) return false
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
    var formMToSave = angular.copy(formM)

    formMToSave.applicant = formMToSave.applicant.url
    formMToSave.currency = formMToSave.currency.url
    formMToSave.date_received = formatDate(formMToSave.date_received)

    if (!kanmiiUnderscore.isEmpty(vm.bid) && vm.bid.amount && vm.bid.goods_description) {
      formMToSave.goods_description = vm.bid.goods_description
      formMToSave.bid = {amount: vm.bid.amount}
    }

    if (vm.formM.selectedIssues.length) formMToSave.issues = vm.formM.selectedIssues

    if (vm.cover && !kanmiiUnderscore.isEmpty(vm.cover)) {
      formMToSave.cover = {
        amount: vm.cover.amount,
        cover_type: vm.cover.cover_type[0]
      }
    }

    if (!vm.detailedFormM) new FormM(formMToSave).$save(formMSavedSuccess, formMSavedError)

    else {
      if (kanmiiUnderscore.all(compareDetailedFormMWithForm1(formMToSave))) {
        formMToSave.do_not_update = 'do_not_update'
        formMToSave.applicant_data = vm.formM.applicant
        formMToSave.currency_data = vm.formM.currency
      }
      formMToSave.id = vm.detailedFormM.id
      new FormM(formMToSave).$put(formMSavedSuccess, formMSavedError)
    }

    function formMSavedSuccess(data) {

      var summary = vm.formM.createFormMMessage() + vm.formM.createIssuesMessage()

      if (data.bid) {
        summary += '\n\nBid Amount     : ' + data.currency_data.code + ' ' + $filter('number')(data.bid.amount, 2)
      }

      $state.go('form_m.add', {detailedFormM: data, showSummary: summary})
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, formMAttributesVerboseNames)
    }
  }

  function compareDetailedFormMWithForm() {
    if (!vm.detailedFormM) return false

    return {
      number: vm.formM.number && angular.equals(vm.formM.number, vm.detailedFormM.number),

      date_received: angular.equals(vm.formM.date_received, new Date(vm.detailedFormM.date_received)),

      amount: vm.formM.amount && angular.equals(vm.formM.amount, Number(vm.detailedFormM.amount)),

      currency: vm.formM.currency && (vm.formM.currency.code === vm.detailedFormM.currency_data.code),

      applicant: vm.formM.applicant && (vm.formM.applicant.name === vm.detailedFormM.applicant_data.name)
    }
  }

  function compareDetailedFormMWithForm1(formM) {
    if (!vm.detailedFormM) return false

    return {
      number: formM.number && angular.equals(formM.number, vm.detailedFormM.number),

      date_received: angular.equals(formM.date_received, new Date(vm.detailedFormM.date_received)),

      amount: formM.amount && angular.equals(formM.amount, Number(vm.detailedFormM.amount)),

      currency: formM.currency && (formM.currency.code === vm.detailedFormM.currency_data.code),

      applicant: formM.applicant && (formM.applicant.name === vm.detailedFormM.applicant_data.name)
    }
  }
}

require('./lc-bid/lc-bid.js')
