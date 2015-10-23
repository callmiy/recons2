"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('add-form-m', [
  'ui.router',
  'rootApp',
  'kanmii-underscore',
  'customer',
  'lc-issue-service',
  'search-detailed-or-uploaded-form-m',
  'form-m-service'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(formMStateURLConfig)

formMStateURLConfig.$inject = ['$stateProvider']

function formMStateURLConfig($stateProvider) {
  $stateProvider
    .state('form_m.add', {
      kanmiiTitle: 'Add form M',

      params: {
        detailedFormM: null
      },

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
  'getTypeAheadLCIssue',
  '$timeout',
  '$filter',
  '$stateParams',
  'LCIssueConcrete'
]

function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
  kanmiiUnderscore, formatDate, xhrErrorDisplay, formMAttributesVerboseNames, FormM, getTypeAheadLCIssue,
  $timeout, $filter, $stateParams, LCIssueConcrete) {
  var vm = this

  vm.detailedFormM = angular.copy($stateParams.detailedFormM)
  $stateParams.detailedFormM = null
  var existingIssues

  initialize()
  function initialize(form) {
    existingIssues = []

    if (vm.detailedFormM) initDetailedFormM()
    else {
      vm.formM = {
        date_received: new Date()
      }

      vm.fieldsEdit = {
        number: false,
        currency: false,
        applicant: false,
        date_received: false,
        amount: false
      }

      vm.closedIssues = []
      vm.nonClosedIssues = []
    }

    vm.searchFormM = {}

    initBidForm()
    initIssuesForm()
    initFormMSavingIndicator()

    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  function initDetailedFormM() {
    existingIssues = vm.detailedFormM.form_m_issues

    vm.closedIssues = []
    vm.nonClosedIssues = []

    vm.detailedFormM.form_m_issues.forEach(function(issue) {
      if (!issue.closed_at) {
        vm.nonClosedIssues.push(issue)
        return true
      }
      else {
        vm.closedIssues.push(issue)
        return false
      }
    })

    vm.formM = {
      date_received: new Date(vm.detailedFormM.date_received),
      number: vm.detailedFormM.number,
      applicant: vm.detailedFormM.applicant_data,
      currency: vm.detailedFormM.currency_data,
      amount: Number(vm.detailedFormM.amount)
    }

    vm.fieldsEdit = {
      number: true,
      currency: true,
      applicant: true,
      date_received: true,
      amount: true
    }

  }

  function initFormMSavingIndicator() {
    vm.savingFormMIndicator = 'Creating New Form M...........please wait'
    vm.formMIsSaving = false
  }

  var issueIds

  function initIssuesForm(issuesForm) {
    vm.showLcIssueContainer = false
    vm.addLcIssuesTitle = 'Add Letter Of Credit Issues'
    vm.issues = []
    issueIds = []
    vm.issue = null

    if (issuesForm) {
      issuesForm.$setPristine()
      issuesForm.$setUntouched()
    }
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

  vm.enableFieldEdit = function enableFieldEdit(field) {
    vm.fieldsEdit[field] = vm.detailedFormM ? !vm.fieldsEdit[field] : false
  }

  vm.closeIssue = function closeIssue(issue, $index) {
    LCIssueConcrete.put({
      id: issue.id,
      mf: vm.detailedFormM.url,
      issue: issue.issue.url,
      closed_at: formatDate(new Date())
    }).$promise.then(issueClosedSuccess, issueClosedError)

    function issueClosedSuccess(issue) {
      vm.nonClosedIssues.splice($index, 1)
      vm.closedIssues.push(issue)
    }

    function issueClosedError(xhr) { xhrErrorDisplay(xhr)}
  }

  vm.toggleShowBidContainer = function toggleShowBidContainer(bidRequestForm) {
    vm.showBidContainer = !vm.showBidContainer

    vm.makeBidTitle = !vm.showBidContainer ? 'Make Bid Request' : 'Dismiss'

    if (!vm.showBidContainer) initBidForm(bidRequestForm)
    else {
      vm.bidRequest.amount = vm.formM.amount
    }
  }

  vm.toggleShowLcIssueContainer = function toggleShowLcIssueContainer() {
    vm.showLcIssueContainer = vm.formM.number && !vm.showLcIssueContainer

    if (!vm.showLcIssueContainer) {
      vm.addLcIssuesTitle = 'Add Letter Of Credit Issues'
      initIssuesForm()
    } else vm.addLcIssuesTitle = 'Dismiss'
  }

  vm.validators = {
    applicant: {
      test: function() {
        return kanmiiUnderscore.isObject(vm.formM.applicant)
      }
    },

    currency: {
      test: function() {
        return kanmiiUnderscore.isObject(vm.formM.currency)
      }
    }
  }

  vm.disableSubmitBtn = disableSubmitBtn
  function disableSubmitBtn(newFormMFormInvalid, bidRequestFormInvalid) {

    if (newFormMFormInvalid) return true

    else if (vm.showBidContainer && bidRequestFormInvalid) return true

    else if (vm.showLcIssueContainer && !vm.issues.length) return true

    var compared = compareDetailedFormMWithForm()

    if (!compared) return false

    else return kanmiiUnderscore.all(compared) && !vm.issues.length && kanmiiUnderscore.isEmpty(vm.bidRequest)

  }

  vm.reset = reset
  function reset(addFormMForm) {
    vm.detailedFormM = null
    initialize()

    if (addFormMForm) {
      addFormMForm.newFormMForm.applicant.$viewValue = null
      addFormMForm.newFormMForm.applicant.$commitViewValue()

      addFormMForm.$setPristine()
      addFormMForm.$setUntouched()
    }
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

    SearchDetailedOrUploadedFormMService.searchWithModal().then(function(data) {
      if (data.detailed) {
        vm.detailedFormM = data.detailed
        initDetailedFormM()

      } else {
        var formM = data.uploaded
        vm.searchFormM = formM
        vm.formM.number = formM.mf

        getTypeAheadCurrency(formM.ccy).then(function(ccy) {
          vm.formM.currency = ccy[0]
        })
      }
    })
  }

  vm.submit = function submit(formM, bidRequest, form) {
    var formMToSave = angular.copy(formM)

    formMToSave.applicant = formMToSave.applicant.url
    formMToSave.currency = formMToSave.currency.url
    formMToSave.date_received = formatDate(formMToSave.date_received)

    var submittedBidRequest = angular.copy(bidRequest)
    if (submittedBidRequest && !kanmiiUnderscore.isEmpty(submittedBidRequest)) {
      formMToSave.goods_description = submittedBidRequest.goods_description

      formMToSave.bid = {
        amount: Number(submittedBidRequest.amount)
      }
    }

    if (vm.issues.length) formMToSave.issues = vm.issues

    if (!vm.detailedFormM) new FormM(formMToSave).$save(formMSavedSuccess, formMSavedError)

    else {
      formMToSave.id = vm.detailedFormM.id
      new FormM(formMToSave).$put(formMSavedSuccess, formMSavedError)
    }

    function formMSavedSuccess(data) {
      vm.detailedFormM = data
      initDetailedFormM()

      vm.savingFormMIndicator = showFormMMessage()

      vm.savingFormMIndicator += showIssuesMessage()

      if (data.bid) {
        vm.savingFormMIndicator += '\n\nBid Amount     : ' + data.currency_data.code + ' ' +
                                   $filter('number')(data.bid.amount, 2)
      }

      vm.formMIsSaving = true

      initBidForm()
      initIssuesForm()

      $timeout(function() {
        vm.formMIsSaving = false
      }, 120000)
    }

    function formMSavedError(xhr) {
      initFormMSavingIndicator()
      xhrErrorDisplay(xhr, formMAttributesVerboseNames)
    }
  }

  vm.hideSavingIndicator = function hideSavingIndicator() {
    vm.formMIsSaving = false
  }

  vm.issueSelected = function issueSelected($item, $model) {
    vm.issues.push($model)
    issueIds.push($model.id)
    vm.issue = null
  }

  vm.deleteIssue = function deleteIssue(index) {
    vm.issues.splice(index, 1)
    issueIds.splice(index, 1)
  }

  vm.getIssue = function getIssue(text) {
    var search = {text: text, exclude_issue_ids: issueIds}

    if (vm.detailedFormM) search.exclude_form_m_issues = vm.detailedFormM.number

    return getTypeAheadLCIssue(search)
  }

  vm.downloadIssues = function downloadIssues() {
    vm.savingFormMIndicator = showFormMMessage()

    vm.savingFormMIndicator += showIssuesMessage()

    vm.formMIsSaving = true
  }

  function showFormMMessage() {
    return 'Form M Number : ' + vm.formM.number + '\n' +
           'Value         : ' + vm.formM.currency.code + ' ' +
           $filter('number')(vm.formM.amount, 2) + '\n' +
           'Applicant     : ' + vm.formM.applicant.name
  }

  function showIssuesMessage() {
    if (!vm.nonClosedIssues.length) return ''

    var issuesText = '\n\n\nPlease note the following issues which must be \n' +
                     'regularized before the LC ' +
                     'request can be treated:\n'
    var index = 1

    kanmiiUnderscore.each(vm.nonClosedIssues, function(issue) {
      issuesText += ('(' + index++ + ') ' + issue.issue.text.replace(/:ISSUE$/i, '') + '\n')
    })

    return issuesText
  }

  function compareDetailedFormMWithForm() {
    if (!vm.detailedFormM) return false

    return {
      number: vm.formM.number && angular.equals(vm.formM.number, vm.detailedFormM.number),

      date_received: angular.equals(vm.formM.date_received, new Date(vm.detailedFormM.date_received)),

      amount: vm.formM.amount && angular.equals(vm.formM.amount, Number(vm.detailedFormM.amount)),

      currency: vm.formM.currency && angular.equals(
        vm.formM.currency.code, vm.detailedFormM.currency_data.code),

      applicant: vm.formM.applicant && angular.equals(
        vm.formM.applicant.name, vm.detailedFormM.applicant_data.name)
    }
  }
}
