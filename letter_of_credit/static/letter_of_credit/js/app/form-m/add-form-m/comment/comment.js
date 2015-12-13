"use strict";

/*jshint camelcase:false*/

var app = angular.module('form-m-comment', [
  'rootApp',
  'kanmii-underscore',
  'comment-service'
])

app.directive('formMComment', formMCommentDirective)

formMCommentDirective.$inject = []

function formMCommentDirective() {
  return {
    restrict: 'A',
    templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m/comment/comment.html'),
    scope: true,
    controller: 'FormMCommentDirectiveController as formMComment'
  }
}

app.controller('FormMCommentDirectiveController', FormMCommentDirectiveController)

FormMCommentDirectiveController.$inject = [
  '$scope',
  'formFieldIsValid',
  'kanmiiUnderscore',
  'xhrErrorDisplay',
  'confirmationDialog',
  'formMObject',
  'resetForm2'
]

function FormMCommentDirectiveController($scope, formFieldIsValid, kanmiiUnderscore, xhrErrorDisplay,
  confirmationDialog, formMObject, resetForm2) {
  var vm = this
  vm.formM = formMObject
  var title = 'Add comment'
  var confirmationTitleLength = 40

  init()
  function init(form) {
    vm.title = title
    vm.formM.showCommentForm = false
    vm.formM.showEditComment = false
    vm.commentToEdit = null
    formMObject.commentText = null

    if (form) resetForm2(form)
  }

  vm.isValid = function (name, validity) { return formFieldIsValid($scope, 'commentForm', name, validity) }

  vm.toggleShow = function toggleShow(form) {
    vm.formM.showCommentForm = vm.formM.amount && vm.formM.number && !vm.formM.showCommentForm

    if (!vm.formM.showCommentForm) init(form)
    else vm.title = 'Dismiss'
  }

  vm.editCommentInvalid = function editCommentInvalid(form) {
    if (kanmiiUnderscore.isEmpty(vm.commentToEdit) || form.$invalid) return true

    return vm.commentToEdit.text === formMObject.commentText
  }

  vm.onCommentDblClick = function onCommentDblClick(comment) {
    vm.formM.showEditComment = true
    vm.formM.showCommentForm = false
    vm.toggleShow()
    vm.commentToEdit = angular.copy(comment)
    formMObject.commentText = vm.commentToEdit.text
  }

  vm.viewComment = function viewComment(comment) {
    confirmationDialog.showDialog({
      title: 'View comment "' + comment.text.slice(0, confirmationTitleLength) + '"',
      text: comment.text,
      infoOnly: true
    })
  }

  vm.editComment = function editComment(text, form) {
    formMObject.editComment(text, vm.commentToEdit).then(function () {init(form)})
  }

  vm.addComment = function addComment(text, form) {
    formMObject.addComment(text).then(function () { init(form) })
  }

  $scope.$watch(function () {return formMObject}, function onFormMObjectChanged() {
    formMObject.commentForm = $scope.commentForm
  }, true)
}
