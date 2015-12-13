"use strict";
/*jshint camelcase:false*/

var app = angular.module('search-detailed-or-uploaded-form-m', [
  'kanmii-underscore',
  'upload-form-m-service',
  'toggle-dim-element',
  'form-m-service'
])

app.factory('SearchDetailedOrUploadedFormMService', SearchDetailedOrUploadedFormMService)
SearchDetailedOrUploadedFormMService.$inject = [
  'UploadFormM',
  'xhrErrorDisplay',
  'ModalService',
  'kanmiiUnderscore',
  '$q',
  'FormM'
]
function SearchDetailedOrUploadedFormMService(UploadFormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q, FormM) {

  function searchFormM(submittedSearchParams) {
    var deferred = $q.defer()
    var mf = submittedSearchParams.mf

    FormM.getPaginated({number: mf}).$promise.then(function(data) {
      if (data.count === 1) {
        deferred.resolve({detailed: data.results[0]})

      } else UploadFormM.query({mf: mf}).$promise.then(searchFormMSuccess, searchFormMError)

    }, searchFormMError)

    function searchFormMSuccess(data) {
      if (data.length === 1) deferred.resolve({uploaded: data[0]})
    }

    function searchFormMError(xhr) {
      xhrErrorDisplay(xhr)
      deferred.reject(xhr)
    }

    return deferred.promise
  }

  function SearchService() {
    var service = this

    service.searchWithModal = searchWithModal
    function searchWithModal() {
      var deferred = $q.defer()

      ModalService.showModal({
        templateUrl: require('lcAppCommons').buildUrl(
          'form-m/search-detailed-or-uploaded-form-m/search-detailed-or-uploaded-form-m-modal.html'),

        controller: 'SearchDetailedOrUploadedFormMServiceModalCtrl as searchUploadedFormMModal'
      }).then(function(modal) {
        modal.element.dialog({
          dialogClass: 'no-close',
          modal: true,
          minWidth: 500,
          title: 'Search Form M',

          close: function() {
            modal.controller.close()
          }
        })

        modal.close.then(function(submittedSearchParams) {
          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
            deferred.resolve(searchFormM(submittedSearchParams))
          }
        })
      })

      return deferred.promise
    }
  }

  return new SearchService()
}

app.controller('SearchDetailedOrUploadedFormMServiceModalCtrl', SearchDetailedOrUploadedFormMServiceModalCtrl)
SearchDetailedOrUploadedFormMServiceModalCtrl.$inject = [
  'close',
  'resetForm',
  '$element'
]
function SearchDetailedOrUploadedFormMServiceModalCtrl(close, resetForm, element) {
  var vm = this

  initForm()
  function initForm() {
    vm.searchParams = {}
  }

  vm.close = close

  vm.reset = reset
  function reset(form) {
    resetForm(form, element, '.form-control', initForm)
    form.$invalid = false
    form.$error = {}
  }
}
