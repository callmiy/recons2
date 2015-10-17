"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('lc-detail', [
  'ui.router',
  'rootApp',
  'lc-service',
  'lc-issue-service',
  'kanmii-underscore',
  'customer'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(bidURLConfig)

bidURLConfig.$inject = ['$stateProvider']

function bidURLConfig($stateProvider) {
  $stateProvider
    .state('lc_detail', {
      url: '/lc/:lc_number',

      params: {lc: null},

      kanmiiTitle: 'Letter of credit',

      templateUrl: require('lcAppCommons').buildUrl('lc/lc-detail/lc-detail.html'),

      controller: 'LetterOfCreditDetailController as lcDetail'
    })
}

app.controller('LetterOfCreditDetailController', LetterOfCreditDetailController)

LetterOfCreditDetailController.$inject = [
  '$stateParams',
  'LetterOfCredit',
  '$state',
  'getTypeAheadCustomer',
  '$filter',
  'getTypeAheadLCIssue',
  'LCIssueConcrete',
  'kanmiiUnderscore',
  'xhrErrorDisplay',
  'formatDate',
  'Customer',
  'formMAttributesVerboseNames'
]

function LetterOfCreditDetailController($stateParams, LetterOfCredit, $state, getTypeAheadCustomer, $filter,
  getTypeAheadLCIssue, LCIssueConcrete, kanmiiUnderscore, xhrErrorDisplay, formatDate, Customer,
  formMAttributesVerboseNames) {
  var vm = this

  initialize()

  function initialize() {
    if ($stateParams.lc) {
      vm.lc = $stateParams.lc
      vm.lcIssues = getIssuesNotClosed(vm.lc.issues)
    }

    else {
      LetterOfCredit.getPaginated({lc_number: $stateParams.lc_number}).$promise.then(function(data) {
        if (data.count) {
          vm.lc = data.results[0]
          vm.lcIssues = getIssuesNotClosed(vm.lc.issues)
        }

        else $state.go('lc')
      })
    }

    vm.lcForm = {}
    vm.alertIsShown = false
    vm.issue = {}

    function getIssuesNotClosed(issues) {
      if (!issues) return []

      return issues.filter(function(issue) {
        return !issue.closed_at
      })
    }
  }

  vm.issueDateGetterSetter = function issueDateGetterSetter() {
    if (vm.lc && vm.lc.estb_date) return $filter('date')(vm.lc.estb_date, 'dd-MMM-yyyy')
  }

  vm.expiryDateGetterSetter = function expiryDateGetterSetter() {
    if (vm.lc && vm.lc.expiry_date) return $filter('date')(vm.lc.expiry_date, 'dd-MMM-yyyy')
  }

  vm.saveIssue = function saveIssue(issue, form) {
    if (issue && !kanmiiUnderscore.isEmpty(issue)) {
      var postData = {
        issue: issue.issue.url,
        mf: vm.lc.mf,
        lc_number: vm.lc.lc_number,
        get_or_create_form_m: true
      }

      var applicant = issue.applicant

      if (applicant && !kanmiiUnderscore.isEmpty(applicant)) {
        postData.form_m_data = {
          applicant: applicant.url,
          currency: vm.lc.ccy_data.url,
          amount: vm.lc.lc_amt_org_ccy,
          lc: vm.lc.url,
          number: vm.lc.mf
        }

      }

      LCIssueConcrete.save(postData).$promise.then(saveSuccess, saveError)
    }

    function saveSuccess(data) {
      vm.lcIssues.unshift({
        issue_text: data.issue_text,
        issue: data.issue,
        id: data.id,
        mf: data.mf
      })

      vm.issue = {}

      if (!vm.lc.applicant_data) { vm.lc.applicant_data = applicant}
      form.$setPristine()
      form.$setUntouched()
    }

    function saveError(xhr) {
      var transform = null
      if (xhr.data.form_m_creation_errors) {
        transform = formMAttributesVerboseNames
        delete xhr.data.form_m_creation_errors
      }
      xhrErrorDisplay(xhr, transform)
    }

  }

  vm.closeIssue = function closeIssue(issue) {
    issue.closed_at = formatDate(new Date())
    LCIssueConcrete.put(issue).$promise.then(function() {

      vm.lcIssues = vm.lcIssues.filter(function(anIssue) {
        return anIssue.id !== issue.id
      })

    }, function(xhr) {
      xhrErrorDisplay(xhr)
    })
  }

  vm.replaceLc = function replaceLc(newLcNumber) {
    LetterOfCredit.getPaginated({lc_number: newLcNumber}).$promise.then(function(data) {
      if (data.count) {
        var lc = data.results[0]

        $state.go('.', {lc_number: lc.lc_number, lc: lc})

      } else vm.alertIsShown = true
    })
  }

  vm.replaceLcFormInvalid = function replaceLcFormInvalid(formInvalid, newLcNumber) {
    return formInvalid || vm.lc.lc_number.toLowerCase().indexOf(newLcNumber.toLowerCase()) !== -1
  }

  vm.customerAdded = function customerAdded(customer) {
    vm.issue.applicant = customer
  }

  vm.getApplicant = getTypeAheadCustomer

  vm.getIssue = function getIssue(text) {
    return getTypeAheadLCIssue({text: text, exclude_form_m_issues: vm.lc.mf})
  }

  vm.addCustomer = function addCustomer() {
    Customer.save({name: vm.lc.applicant}).$promise.then(function(data) {
      vm.issue.applicant = data
      vm.lc.applicant_data = data
    })
  }

  vm.closeAlert = function closeAlert() {
    vm.alertIsShown = false
  }
}
