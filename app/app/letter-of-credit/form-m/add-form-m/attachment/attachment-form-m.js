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
  'formMObject',
]

function FormMAttachmentDirectiveController(formMObject) {
  var vm = this
  vm.formM = formMObject

  init()
  function init() {
    vm.showAttachment = false
    vm.attachments = []
    vm.selectedAttachments = []
  }

  vm.attachmentContext = {
    content_type: formMObject.ct_url,
    object_id: formMObject._id
  }

  vm.toggleShow = function toggleShow() {
    vm.showAttachment = formMObject._id && !vm.showAttachment
  }

  vm.attachmentFileAdded = function attachmentFileAdded($attachmentFile) {
    vm.selectedAttachments.push( $attachmentFile )
    console.log( $attachmentFile )
  }

  vm.deleteSelectedAttachment = function deleteSelectedAttachment($index, deleteAll) {
    if ( $index !== null ) vm.selectedAttachments.splice( $index, 1 )
    else if ( deleteAll ) vm.selectedAttachments = []
  }

  vm.uploadFiles = function uploadFiles() {
  }
}
