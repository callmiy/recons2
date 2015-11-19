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
      onIssuesChanged: '&'
    },
    controller: 'LcIssueDirectiveController as lcIssue'
  }
}

app.controller('LcIssueDirectiveController', LcIssueDirectiveController)

LcIssueDirectiveController.$inject = [
  '$scope',
  'getTypeAheadLCIssue',
  'resetForm2',
  'clearFormField',
  'formMObject'
]

function LcIssueDirectiveController($scope, getTypeAheadLCIssue, resetForm2, clearFormField, formMObject) {
  var vm = this
  vm.formM = formMObject
  var title = 'Add Letter Of Credit Issues'

  initContainerVars()
  function initContainerVars(form) {
    vm.title = title
    vm.showContainer = false

    if (form) resetForm2(form, [
      {form: form, elements: ['issue']}
    ])
  }

  vm.issueSelected = function issueSelected($item, $model) {
    vm.formM.selectedIssues.push($model)
    vm.formM.issue = null
    clearFormField($scope.issuesForm, 'issue')
  }

  vm.deleteIssue = function deleteIssue(index) {
    vm.formM.selectedIssues.splice(index, 1)
  }

  vm.getIssue = function getIssue(text) {
    var _ids = []

    vm.formM.selectedIssues.forEach(function (issue) {
      _ids.push(issue.id)
    })

    var x = []

    x.concat(vm.formM.nonClosedIssues).concat(vm.formM.closedIssues).forEach(function (issue) {
      _ids.push(issue.issue.id)
    })

    return getTypeAheadLCIssue({text: text, exclude_issue_ids: _ids.join(',')})
  }

  vm.toggleShow = function toggleShow(form) {
    vm.showContainer = vm.formM.amount && vm.formM.number && !vm.showContainer

    if (!vm.showContainer) initContainerVars(form)
    else vm.title = 'Dismiss'
  }

  $scope.$watch(function getFormM() {return vm.formM}, function () {
    vm.formM.issuesForm = $scope.issuesForm
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
        return !vm.showContainer || Boolean(vm.formM.selectedIssues.length)
      }
    }
  }
})
