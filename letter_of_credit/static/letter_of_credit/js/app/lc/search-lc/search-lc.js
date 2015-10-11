"use strict";
/*jshint camelcase:false*/

var app = angular.module('search-lc', [
  'kanmii-underscore',
  'toggle-dim-element',
  'form-m-service',
  'lc-service'
])

app.factory('SearchLc', SearchLc)
SearchLc.$inject = [
  'xhrErrorDisplay',
  'ModalService',
  'kanmiiUnderscore',
  '$q',
  'ToggleDimElement',
  'LetterOfCredit'
]
function SearchLc(xhrErrorDisplay, ModalService, kanmiiUnderscore, $q, ToggleDimElement, LetterOfCredit) {

  function searchLc(submittedSearchParams) {
    var deferred = $q.defer()
    var searchParams = angular.copy(submittedSearchParams)

    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
    if (searchParams.currency) searchParams.currency = searchParams.currency.code

    LetterOfCredit.getPaginated(searchParams).$promise.then(searchLcSuccess, searchLcError)

    function searchLcSuccess(data) {
      deferred.resolve(data)
    }

    function searchLcError(xhr) {
      xhrErrorDisplay(xhr)
      deferred.reject(xhr)
    }

    return deferred.promise
  }

  function SearchService() {
    var service = this

    service.searchWithModal = searchWithModal
    function searchWithModal(config) {
      var deferred = $q.defer()
      config = config || {}

      ModalService.showModal({
        templateUrl: require('lcAppCommons').buildUrl('lc/search-lc/search-lc.html'),
        controller: 'SearchLcModalCtrl as searchLcModal',
        inputs: {
          uiOptions: config.uiOptions
        }

      }).then(function(modal) {
        modal.element.dialog({
          dialogClass: 'no-close',
          modal: true,
          minWidth: 600,
          minHeight: 450,
          title: 'Search Letter of credit',

          open: function() {
            config.dim && ToggleDimElement.dim(config.parent, config.dimCb)
          },

          close: function() {
            config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb)
          }
        })

        modal.close.then(function(submittedSearchParams) {
          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
            deferred.resolve(searchLc(submittedSearchParams))
          }

          config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb)
        })
      })

      return deferred.promise
    }
  }

  return new SearchService()
}

app.controller('SearchLcModalCtrl', SearchLcModalCtrl)
SearchLcModalCtrl.$inject = [
  'close',
  'resetForm',
  '$element',
  'getTypeAheadCustomer',
  'getTypeAheadCurrency'
]
function SearchLcModalCtrl(close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
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

  vm.submitSearchParams = submitSearchParams
  function submitSearchParams(searchParams) {
    close(searchParams)
  }

  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency
}
