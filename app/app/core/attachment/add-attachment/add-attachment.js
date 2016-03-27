"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'add-attachment', [
  'attachment-service',
  'rootApp',
  'complex-object-validator',
  'ngFileUpload',
] )

app.directive( 'addAttachment', addAttachmentDirective )

addAttachmentDirective.$inject = []

function addAttachmentDirective() {
  return {
    restrict: 'AE',
    template: require( './add-attachment.html' ),
    scope: true,
    bindToController: {
      kmTitle: '=',
      onAttachmentFileAdded: '&',
      attachmentContext: '=',
    },
    controller: 'addAttachmentController as attachment'
  }
}

app.controller( 'addAttachmentController', addAttachmentController )
addAttachmentController.$inject = [
  'resetForm2',
  'Upload',
  'urls',
]
function addAttachmentController(resetForm2, Upload, urls) {
  var vm = this //jshint -W040

  init()
  function init(form) {
    vm.attachment = {
      files: []
    }

    if ( form ) resetForm2( form )
  }

  vm.deleteFile = function deleteFile($index) {
    vm.attachment.files.splice( $index, 1 )
  }

  vm.onFilesSelected = function onFilesSelected($files) {
    var len = $files.length
    if ( !($files && len) ) return

    var files = vm.attachment.files
    var attachmentFiles = files
    var filesLen = files.length

    for ( var i = 0; i < len; i++ ) {
      var selectedFile = $files[i]
      var exists = false

      for ( var j = 0; j < filesLen; j++ ) {
        if ( angular.equals( selectedFile, files[j] ) ) {
          exists = true
          break
        }
      }

      if ( !exists ) attachmentFiles.push( selectedFile )
    }

    vm.attachment.files = attachmentFiles
  }

  vm.addAttachment = function addAttachment(attachment, form) {
    //vm.onAttachmentFileAdded( { $attachmentFile: attachment } )

    Upload.upload( {
      url: urls.attachmentAPIUrl,
      data: Object.assign( attachment, vm.attachmentContext )

    } ).then( function (response) {
      console.log( response )
      init( form )

    }, function (xhr) {
      if ( xhr.status > 0 ) {
        console.log( xhr )
      }
    } )
  }

  vm.clearForm = function clearForm(form) {
    init( form )
  }
}
