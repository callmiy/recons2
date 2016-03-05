"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'lc-issue', [
  'rootApp',
  'add-form-m-form-m-object'
] )

app.directive( 'lcIssue', lcIssueDirective )

lcIssueDirective.$inject = []

function lcIssueDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'lcAppCommons' ).buildUrl( 'form-m/add-form-m/lc-issue/lc-issue.html' ),
    scope: true,
    bindToController: {
      onIssuesChanged: '&'
    },
    controller: 'LcIssueDirectiveController as lcIssue'
  }
}

app.controller( 'LcIssueDirectiveController', LcIssueDirectiveController )

LcIssueDirectiveController.$inject = [
  '$scope',
  'resetForm2',
  'clearFormField',
  'formMObject'
]

function LcIssueDirectiveController($scope, resetForm2, clearFormField, formMObject) {
  var vm = this
  vm.formM = formMObject
  var title = 'Add Letter Of Credit Issues'

  init()
  function init(form) {
    vm.title = title
    formMObject.selectedIssues = []
    formMObject.issue = null

    if ( form ) resetForm2( form, [
      { form: form, elements: ['issue'] }
    ] )
  }

  vm.issueSelected = function issueSelected($item, $model) {
    formMObject.selectedIssues.push( $model )
    formMObject.issue = null
    clearFormField( $scope.issuesForm, 'issue' )
  }

  vm.deleteIssue = function deleteIssue(index) {
    vm.formM.selectedIssues.splice( index, 1 )
  }

  vm.toggleShow = function toggleShow(form) {
    if ( vm.formM.deleted_at ) {
      formMObject.showIssueForm = false
      return
    }

    formMObject.showIssueForm = vm.formM.amount && vm.formM.number && !formMObject.showIssueForm

    if ( !formMObject.showIssueForm ) init( form )
    else vm.title = 'Dismiss'
  }

  $scope.$watch( function getFormM() {return vm.formM}, function (formM) {
    vm.formM.issuesForm = $scope.issuesForm

    if ( formM ) {
      if ( !formM.amount || !formM.number ) {
        init( formMObject.issueForm )
      }
    }
  }, true )

  $scope.$watch( function getShowContainer() {return formMObject.showIssueForm}, function onUpdateShowContainer() {
    $scope.issuesForm.issue.$validate()
  } )
}

app.directive( 'validateIssues', function validateIssues() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, elm, attributes, ctrl) {
      var vm = $scope.lcIssue
      ctrl.$validators.issues = function () {
        return !vm.formM.showIssueForm || Boolean( vm.formM.selectedIssues.length )
      }
    }
  }
} )
