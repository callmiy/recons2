"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'form-m-attachment', [
  'rootApp',
  'add-attachment'
] )

app.directive( 'formMAttachment', formMAttachmentDirective )

formMAttachmentDirective.$inject = []

function formMAttachmentDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' ).buildUrl(
      'letter-of-credit', 'form-m/add-form-m/attachment/attachment-form-m.html' ),
    scope: true,
    controller: 'FormMAttachmentDirectiveController as formMAttachment'
  }
}

app.controller( 'FormMAttachmentDirectiveController', FormMAttachmentDirectiveController )

FormMAttachmentDirectiveController.$inject = [
  '$scope',
  'formFieldIsValid',
  'underscore',
  'confirmationDialog',
  'formMObject',
  'resetForm2'
]

function FormMAttachmentDirectiveController($scope, formFieldIsValid, underscore, confirmationDialog, formMObject,
  resetForm2) {
  var vm = this
  vm.formM = formMObject
  var confirmationTitleLength = 40

  init()
  function init(form) {
    vm.showAttachment = false
    vm.formM.showEditComment = false
    vm.commentToEdit = null
    formMObject.commentText = null

    if ( form ) resetForm2( form )
  }

  vm.isValid = function (name, validity) { return formFieldIsValid( $scope, 'commentForm', name, validity ) }

  vm.toggleShow = function toggleShow() {
    vm.showAttachment = formMObject._id && !vm.showAttachment
  }

  vm.editCommentInvalid = function editCommentInvalid(form) {
    if ( underscore.isEmpty( vm.commentToEdit ) || form.$invalid ) return true

    return vm.commentToEdit.text === formMObject.commentText
  }

  vm.onCommentDblClick = function onCommentDblClick(comment) {
    vm.formM.showEditComment = true
    vm.showAttachment = false
    vm.toggleShow()
    vm.commentToEdit = angular.copy( comment )
    formMObject.commentText = vm.commentToEdit.text
  }

  vm.viewComment = function viewComment(comment) {
    confirmationDialog.showDialog( {
      title: 'View comment "' + comment.text.slice( 0, confirmationTitleLength ) + '"',
      text: comment.text,
      infoOnly: true
    } )
  }

  vm.editComment = function editComment(text, form) {
    formMObject.editComment( text, vm.commentToEdit ).then( function () {init( form )} )
  }

  vm.addComment = function addComment(text, form) {
    formMObject.addComment( text ).then( function () { init( form ) } )
  }

  $scope.$watch( function () {return formMObject}, function onFormMObjectChanged(formM) {
    formMObject.commentForm = $scope.commentForm

    if ( formM ) {
      if ( !formM.amount || !formM.number ) init( formMObject.commentForm )
    }
  }, true )
}
