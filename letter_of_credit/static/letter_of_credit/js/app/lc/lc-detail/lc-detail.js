"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('lc-detail', [
  'ui.router',
  'rootApp',
  'lc-service',
  'lc-issue-service',
  'kanmii-underscore'
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
  'formatDate'
]

function LetterOfCreditDetailController($stateParams, LetterOfCredit, $state, getTypeAheadCustomer, $filter,
  getTypeAheadLCIssue, LCIssueConcrete, kanmiiUnderscore, xhrErrorDisplay, formatDate) {
  var vm = this

  initialize()

  function initialize() {
    if ($stateParams.lc) {
      vm.lc = $stateParams.lc
      vm.lcIssues = vm.lc.issues
    }

    else {
      LetterOfCredit.getPaginated({lc_number: $stateParams.lc_number}).$promise.then(function(data) {
        if (data.count) {
          vm.lc = data.results[0]
          vm.lcIssues = vm.lc.issues
        }

        else $state.go('lc')
      })
    }

    vm.lcForm = {
      applicant_obj: {}
    }

    vm.issue = {}
  }

  vm.issueDateGetterSetter = function issueDateGetterSetter() {
    if (vm.lc && vm.lc.estb_date) return $filter('date')(vm.lc.estb_date, 'dd-MMM-yyyy')
  }

  vm.expiryDateGetterSetter = function expiryDateGetterSetter() {
    if (vm.lc && vm.lc.expiry_date) return $filter('date')(vm.lc.expiry_date, 'dd-MMM-yyyy')
  }

  vm.saveIssue = function saveIssue(issue, form) {
    if (issue && !kanmiiUnderscore.isEmpty(issue)) {
      var postData = {issue: issue.issue.url, mf: vm.lc.mf}

      var applicant = issue.applicant

      if (applicant && !kanmiiUnderscore.isEmpty(applicant)) {
        postData.form_m_data = {
          applicant: applicant.url,
          currency: vm.lc.ccy_data.url,
          amount: vm.lc.lc_amt_org_ccy,
          lc: vm.lc.url,
          number: vm.lc.mf
        }

      } else postData.get_form_m = true

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
      form.$setPristine()
      form.$setUntouched()
    }

    function saveError(xhr) {
      xhrErrorDisplay(xhr)
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

  vm.getApplicant = getTypeAheadCustomer

  vm.getIssue = function getIssue(text) {
    return getTypeAheadLCIssue({text: text, exclude_form_issues: vm.lc.mf})
  }
}
