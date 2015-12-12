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
  init()

  function init(form) {
    vm.title = title
    vm.formM.showCommentForm = false
    vm.formM.showEditComment = false
    vm.commentToEdit = null
    formMObject.comment = null

    if (form) resetForm2(form)
  }

  vm.isValid = function (name, validity) {
    return formFieldIsValid($scope, 'commentForm', name, validity)
  }

  vm.toggleShow = function toggleShow(form) {
    vm.formM.showCommentForm = !vm.formM.showCommentForm

    if (!vm.formM.showCommentForm) init(form)
    else vm.title = 'Dismiss'
  }

  vm.editCommentInvalid = function editCommentInvalid(form) {
    if (kanmiiUnderscore.isEmpty(vm.commentToEdit)) return true

    if (form.$invalid) return true

    return kanmiiUnderscore.all(commentNotModified())
  }

  vm.onCommentDblClick = function onCommentDblClick(comment, $index) {
    vm.formM.showEditComment = true
    vm.formM.showCommentForm = false
    vm.toggleShow()
    vm.commentToEdit = angular.copy(comment)
    vm.commentToEdit.$index = $index
  }

  vm.trashComment = function trashComment(comment, $index) {
    var text = '\n\nComment:\n' + comment.text
    console.log($index)

    confirmationDialog.showDialog({
      text: 'Sure you want to delete comment:' + text, title: 'Delete comment for ' + comment.text.slice(0, 5)
    }).then(function (answer) {
      if (answer) {
      }
    })
  }

  vm.editComment = function editComment() {
    var title = 'Edit comment "' + formMObject.comment.text.slice(0, 5) + '"'
    var text = '\n\nForm M:           ' + formMObject.comment.text.slice(0, 5)

    confirmationDialog.showDialog({
      title: title,
      text: 'Are you sure you want to edit comment:' + text
    }).then(function (answer) {
      if (answer) doEdit()
    })

    function doEdit() {
    }
  }

  function commentNotModified() {
    return {
      amount: vm.commentToEdit.text === formMObject.comment.text
    }
  }

  $scope.$watch(function () {return formMObject}, function onFormMObjectChanged() {
    formMObject.commentForm = $scope.commentForm
  }, true)
}
