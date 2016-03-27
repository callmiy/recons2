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
    vm.showAddAttachmentForm = showAddAttachmentForm()
  }

  function showAddAttachmentForm() {
    return !formMObject.attachments.length
  }

  vm.attachmentContext = {
    content_type: formMObject.ct_url,
    object_id: formMObject._id
  }

  vm.toggleShow = function toggleShow() {
    vm.showAttachment = formMObject._id && !vm.showAttachment

    if ( vm.showAttachment ) vm.showAddAttachmentForm = showAddAttachmentForm()
  }

  vm.toggleAddAttachmentForm = function toggleAddAttachmentForm() {

  }

  vm.attachmentFileAdded = function attachmentFileAdded(attachmentFileAddedResult) {
    console.log( attachmentFileAddedResult )

    if ( attachmentFileAddedResult.result ) {
      formMObject.setAttachments()
    }
  }

  vm.deleteAttachment = function deleteAttachment($index, deleteAll) {
    if ( $index !== null ) vm.selectedAttachments.splice( $index, 1 )
    else if ( deleteAll ) vm.selectedAttachments = []
  }

  vm.getFileName = function getFileName(name) {
    var len = name.length

    if ( len < 41 ) return name

    var EXT_REGEX = new RegExp( "\\.[\\w]+$", 'i' )
    var ext = EXT_REGEX.exec( name )
    ext = ext ? ext[0] : ''
    var extLen = ext.length
    len = len - extLen
    name = name.replace( EXT_REGEX, '' )

    return name.slice( 0, 27 ) + '...' + name.slice( len - 5 ) + ext
  }
}
