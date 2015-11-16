"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-issue', [
  'rootApp',
  'lc-issue-service',
  'add-form-m-form-m-object'
])

app.directive('lcIssue', lcIssueDirective)

lcIssueDirective.$inject = []

function lcIssueDirective() {
  return {
    restrict: 'A',
    templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m/lc-issue/lc-issue.html'),
    scope: true,
    bindToController: {
      formM: '=mfContext',
      issues: '=',
      onIssuesChanged: '&',
      onNonClosedIssuesChanged: '&'
    },
    controller: 'LcIssueDirectiveController as lcIssue'
  }
}

app.controller('LcIssueDirectiveController', LcIssueDirectiveController)

LcIssueDirectiveController.$inject = [
  '$scope',
  'LCIssueConcrete',
  'getTypeAheadLCIssue',
  'formatDate',
  'xhrErrorDisplay',
  'resetForm2',
  'clearFormField',
  'confirmationDialog',
  'formMObject'
]

function LcIssueDirectiveController($scope, LCIssueConcrete, getTypeAheadLCIssue, formatDate, xhrErrorDisplay,
  resetForm2, clearFormField, confirmationDialog, formMObject) {
  var vm = this
  var title = 'Add Letter Of Credit Issues'

  initExistingIssues()
  function initExistingIssues() {
    vm.closedIssues = []
    vm.nonClosedIssues = []
  }

  initContainerVars()
  function initContainerVars(form) {
    vm.title = title
    vm.showContainer = false

    vm.issues = []
    vm.issue = null

    if (form) resetForm2(form, [
      {form: form, elements: ['issue']}
    ])
  }

  vm.closeIssue = function closeIssue(issue, $index) {
    var closedAt = formatDate(new Date())

    var text = 'Sure you want to close issue:\n"' +
      $scope.addFormMState.formatIssueText(issue.issue.text) + '"?'

    confirmationDialog.showDialog({title: 'Close issue', text: text}).then(function (answer) {
      if (answer) {
        LCIssueConcrete.put({
          id: issue.id,
          mf: vm.formM.url,
          issue: issue.issue.url,
          closed_at: closedAt
        }).$promise.then(issueClosedSuccess, issueClosedError)
      }
    })

    function issueClosedSuccess() {
      var text = 'Issue closed successfully:\n' + $scope.addFormMState.formatIssueText(issue.issue.text)
      confirmationDialog.showDialog({title: 'Close issue', text: text, infoOnly: true})
      vm.nonClosedIssues.splice($index, 1)
      issue.closed_at = closedAt
      vm.closedIssues.push(issue)
    }

    function issueClosedError(xhr) {xhrErrorDisplay(xhr)}
  }

  vm.issueSelected = function issueSelected($item, $model) {
    vm.issues.push($model)
    vm.issue = null
    clearFormField($scope.issuesForm, 'issue')
  }

  vm.deleteIssue = function deleteIssue(index) {
    vm.issues.splice(index, 1)
  }

  vm.getIssue = function getIssue(text) {
    var _ids = []

    vm.issues.forEach(function (issue) {
      _ids.push(issue.id)
    })

    var x = []

    x.concat(vm.nonClosedIssues).concat(vm.closedIssues).forEach(function (issue) {
      _ids.push(issue.issue.id)
    })

    return getTypeAheadLCIssue({text: text, exclude_issue_ids: _ids.join(',')})
  }

  vm.toggleShow = function toggleShow(form) {
    vm.showContainer = vm.formM.amount && vm.formM.number && !vm.showContainer

    if (!vm.showContainer) initContainerVars(form)
    else vm.title = 'Dismiss'
  }

  $scope.$watch(function getFormM() {return vm.formM}, function (newFormM) {
    if (newFormM) {
      var formMIssues = newFormM.form_m_issues
      if (formMIssues && formMIssues.length !== (vm.closedIssues.length + vm.nonClosedIssues.length)) {
        formMIssues.forEach(function (issue) {
          if (!issue.closed_at) {
            vm.nonClosedIssues.push(issue)
            return true
          }
          else {
            vm.closedIssues.push(issue)
            return false
          }
        })
      }

      if (!newFormM.number || !newFormM.amount) {
        initExistingIssues()
        initContainerVars()
      }
    }
  }, true)

  $scope.$watch(function getIssues() {return vm.issues}, function onUpdateIssues(newIssues) {
    $scope.issuesForm.issue.$validate()
    if (newIssues) vm.onIssuesChanged({issues: newIssues, issuesForm: $scope.issuesForm})
  }, true)

  $scope.$watch(function getNonClosedIssues() {return vm.nonClosedIssues}, function onUpdateNonClosedIssues(newIssues) {
    if (newIssues) vm.onNonClosedIssuesChanged({issues: newIssues})
  }, true)

  $scope.$watch(function getShowContainer() {return vm.showContainer}, function onUpdateShowContainer() {
    $scope.issuesForm.issue.$validate()
  })
}

app.directive('validateIssues', function validateIssues() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, elm, atts, ctrl) {
      var vm = $scope.lcIssue
      ctrl.$validators.issues = function () {
        return !vm.showContainer || Boolean(vm.issues.length)
      }
    }
  }
})
