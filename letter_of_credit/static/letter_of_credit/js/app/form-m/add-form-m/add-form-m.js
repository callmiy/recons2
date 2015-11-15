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

  /*
   *@param {angular.form} the HTML fieldSet element for form M issues
   */
  var issuesForm

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

      } else  {
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

    /*
     *@param {angular.form.model} the form M issues model
     */
    vm.issues = []
    vm.closedIssues = []
    vm.nonClosedIssues = []
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

  vm.onIssuesChanged = function onIssuesChanged(issues, form) {
    vm.issues = issues
    issuesForm = form
  }

  vm.onNonClosedIssuesChanged = function onNonClosedIssuesChanged(issues) {
    vm.nonClosedIssues = issues
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

    if (issuesForm && issuesForm.$invalid) return true

    if (vm.showEditBid) return true

    var compared = compareDetailedFormMWithForm()

    if (!compared) return false

    if (kanmiiUnderscore.all(compared)) {
      if (!kanmiiUnderscore.isEmpty(vm.bid) && vm.bid.goods_description && vm.bid.amount) return false
      if (vm.cover && !kanmiiUnderscore.isEmpty(vm.cover)) return false
      return !vm.issues.length
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

    if (vm.issues.length) formMToSave.issues = vm.issues

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
      //even though non-closed issues will be set in the lc-issue directive, we need to read them off data received
      //from server so we can display them as part of summary to users. :TODO find a better implementation
      vm.nonClosedIssues = data.form_m_issues.filter(function (issue) {
        return !issue.closed_at
      })

      var summary = showFormMMessage() + showIssuesMessage()

      if (data.bid) {
        summary += '\n\nBid Amount     : ' + data.currency_data.code + ' ' + $filter('number')(data.bid.amount, 2)
      }

      if (data.cover) data.covers.push(data.cover)

      $state.go('form_m.add', {detailedFormM: data, showSummary: summary})
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, formMAttributesVerboseNames)
    }
  }

  vm.downloadSummary = function downloadSummary() {
    confirmationDialog.showDialog({
      title: vm.formM.number,
      text: $scope.showFormMMessage() + $scope.showIssuesMessage(),
      infoOnly: true
    })
  }

  $scope.showFormMMessage = showFormMMessage
  function showFormMMessage() {
    var number = $filter('number')(vm.formM.amount, 2)
    var header = vm.formM.applicant.name + ' - ' + vm.formM.number + ' - ' + vm.formM.currency.code + ' ' + number
    return header + '\n\nForm M Number : ' + vm.formM.number + '\n' +
      'Value         : ' + vm.formM.currency.code + ' ' +
      number + '\n' +
      'Applicant     : ' + vm.formM.applicant.name
  }

  $scope.showIssuesMessage = showIssuesMessage
  function showIssuesMessage() {
    if (!vm.nonClosedIssues.length) return ''

    var issuesText = '\n\n\nPlease note the following issues which must be regularized before the LC ' +
      'request can be treated:\n'

    kanmiiUnderscore.each(vm.nonClosedIssues, function (issue, index) {
      ++index
      issuesText += ('(' + index + ') ' + vm.formatIssueText(issue.text || issue.issue.text) + '\n')
    })

    return issuesText
  }

  vm.formatIssueText = function (text) {
    return text.replace(/:ISSUE$/i, '')
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
