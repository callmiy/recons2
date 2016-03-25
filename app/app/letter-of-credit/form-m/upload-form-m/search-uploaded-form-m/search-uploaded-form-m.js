"use strict";
/*jshint camelcase:false*/

var app = angular.module( 'search-uploaded-form-m', [
  'kanmii-underscore',
  'upload-form-m-service',
  'toggle-dim-element'
] )

app.factory( 'SearchUploadedFormMService', SearchUploadedFormMService )
SearchUploadedFormMService.$inject = [
  'UploadFormM',
  'xhrErrorDisplay',
  'ModalService',
  'kanmiiUnderscore',
  '$q'
]
function SearchUploadedFormMService(UploadFormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q) {

  function searchFormM(submittedSearchParams) {
    var deferred = $q.defer()
    var searchParams = angular.copy( submittedSearchParams )

    if ( searchParams.applicant ) searchParams.applicant = searchParams.applicant.name
    if ( searchParams.currency ) searchParams.currency = searchParams.currency.code

    UploadFormM.query( searchParams ).$promise.then( searchFormMSuccess, searchFormMError )

    function searchFormMSuccess(data) {
      deferred.resolve( data )
    }

    function searchFormMError(xhr) {
      xhrErrorDisplay( xhr )
      deferred.reject( xhr )
    }

    return deferred.promise
  }

  function SearchService() {
    var service = this

    service.searchWithModal = searchWithModal
    function searchWithModal() {
      var deferred = $q.defer()

      ModalService.showModal( {
        templateUrl: require( 'commons' ).buildUrl(
          'letter-of-credit',
          'form-m/upload-form-m/search-uploaded-form-m/search-uploaded-form-m-modal.html' ),

        controller: 'SearchUploadedFormMServiceModalCtrl as searchUploadedFormMModal'
      } ).then( function (modal) {
        modal.element.dialog( {
          dialogClass: 'no-close',
          modal: true,
          minWidth: 600,
          minHeight: 250,
          title: 'Search Uploaded Form M',

          close: function () {
            modal.close.then()
          }
        } )

        modal.close.then( function (submittedSearchParams) {
          if ( submittedSearchParams && angular.isObject( submittedSearchParams ) && !kanmiiUnderscore.isEmpty( submittedSearchParams ) ) {
            deferred.resolve( searchFormM( submittedSearchParams ) )
          }
        } )
      } )

      return deferred.promise
    }
  }

  return new SearchService()
}

app.controller( 'SearchUploadedFormMServiceModalCtrl', SearchUploadedFormMServiceModalCtrl )
SearchUploadedFormMServiceModalCtrl.$inject = [
  'close',
  'resetForm',
  '$element'
]
function SearchUploadedFormMServiceModalCtrl(close, resetForm, element) {
  var vm = this

  initForm()
  function initForm() {
    vm.searchParams = {}
  }

  vm.close = close

  vm.reset = reset
  function reset(form) {
    resetForm( form, element, '.form-control', initForm )
    form.$invalid = false
    form.$error = {}
  }

  vm.submitSearchParams = submitSearchParams
  function submitSearchParams(searchParams) {
    close( searchParams )
  }
}
