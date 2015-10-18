"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('add-form-m-state', [
  'ui.router',
  'rootApp',
  'kanmii-underscore',
  'customer',
  'search-uploaded-form-m',
  'form-m-service'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(formMStateURLConfig)

formMStateURLConfig.$inject = ['$stateProvider']

function formMStateURLConfig($stateProvider) {
  $stateProvider
    .state('form_m.add', {
      kanmiiTitle: 'Add form M',

      views: {
        addFormM: {
          templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m-state/add-form-m-state.html'),

          controller: 'AddFormMStateController as addFormMState'
        }
      }
    })
}

app.controller('AddFormMStateController', AddFormMStateController)

AddFormMStateController.$inject = [
  'getTypeAheadCustomer',
  'getTypeAheadCurrency',
  'SearchUploadedFormMService',
  'kanmiiUnderscore',
  'formatDate',
  'xhrErrorDisplay',
  'formMAttributesVerboseNames',
  'FormM',
  '$scope'
]

function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchUploadedFormMService,
  kanmiiUnderscore, formatDate, xhrErrorDisplay, formMAttributesVerboseNames, FormM, $scope) {
  var vm = this

  initialize()
  function initialize() {
    vm.formM = {
      date_received: new Date()
    }

    vm.searchFormM = {}

    vm.showLcIssueContainer = false
    vm.addLcIssuesTitle = 'Add Letter Of Credit Issues'
    vm.selectedLcIssues = {}

    initBidForm()
  }

  function initBidForm(bidForm) {
    vm.showBidContainer = false
    vm.makeBidTitle = 'Make Bid Request'
    vm.bidRequest = {}

    if (bidForm) {
      bidForm.$setPristine()
      bidForm.$setUntouched()
    }
  }

  vm.toggleShowBidContainer = toggleShowBidContainer
  function toggleShowBidContainer(bidRequestForm) {
    vm.showBidContainer = !vm.showBidContainer

    vm.makeBidTitle = !vm.showBidContainer ? 'Make Bid Request' : 'Dismiss'

    if (!vm.showBidContainer) initBidForm(bidRequestForm)
    else {
      vm.bidRequest.amount = vm.formM.amount
    }
  }

  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
  function toggleShowLcIssueContainer() {
    vm.showLcIssueContainer = !vm.showLcIssueContainer

    vm.addLcIssuesTitle = !vm.showLcIssueContainer ? 'Add Letter Of Credit Issues' : 'Dismiss'
  }

  vm.disableSubmitBtn = disableSubmitBtn
  function disableSubmitBtn(newFormMFormInvalid, bidRequestFormInvalid) {

    if (newFormMFormInvalid) return true
    else if (vm.showBidContainer && bidRequestFormInvalid) return true
    return false
  }

  vm.reset = reset
  function reset(form) {
    initialize()
    form.$setPristine()
    form.$setUntouched()
  }

  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency

  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.datePickerIsOpen = false
  vm.openDatePicker = openDatePicker
  function openDatePicker() {
    vm.datePickerIsOpen = true
  }

  vm.getUploadedFormM = function getUploadedFormM() {
    vm.searchFormM = {}

    SearchUploadedFormMService.searchWithModal().then(function(data) {
      if (data.length === 1) {
        var formM = data[0]
        vm.searchFormM = formM
        vm.formM.number = formM.mf

        getTypeAheadCurrency(formM.ccy).then(function(ccy) {
          vm.formM.currency = ccy[0]
        })
      }
    })
  }

  vm.submit = function submit(formM, bidRequest) {
    console.log(formM, '\n\n\n\n', bidRequest)

    var formMToSave = angular.copy(formM)
    formMToSave.applicant = formMToSave.applicant.url
    formMToSave.currency = formMToSave.currency.url
    formMToSave.date_received = formatDate(formMToSave.date_received)

    var submittedBidRequest = angular.copy(bidRequest)
    if (submittedBidRequest && !kanmiiUnderscore.isEmpty(submittedBidRequest)) {
      formMToSave.goods_description = submittedBidRequest.goods_description

      formMToSave.bid = {
        amount: submittedBidRequest.amount
      }
    }

    new FormM(formMToSave).$save(formMSavedSuccess, formMSavedError)

    function formMSavedSuccess(data) {
      console.log('new form m created = ', data);
      $scope.tabs.listFormM.active = true
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, formMAttributesVerboseNames)
    }
  }
}
