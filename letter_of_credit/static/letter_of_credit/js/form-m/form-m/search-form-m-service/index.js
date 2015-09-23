"use strict";
/*jshint camelcase:false*/

var app = angular.module('form-m-search-service', ['kanmii-underscore'])

app.factory('SearchFormMService', SearchFormMService)
SearchFormMService.$inject = ['FormM', 'xhrErrorDisplay', 'ModalService', 'kanmiiUnderscore', '$q']
function SearchFormMService(FormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q) {

  function searchFormM(submittedSearchParams) {
    var deferred = $q.defer()
    var searchParams = angular.copy(submittedSearchParams)

    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
    if (searchParams.currency) searchParams.currency = searchParams.currency.code

    FormM.getPaginated(searchParams).$promise.then(searchFormMSuccess, searchFormMError)

    function searchFormMSuccess(data) {
      deferred.resolve(data)
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
    function searchWithModal(config) {
      var deferred = $q.defer()
      config = config || {}

      ModalService.showModal({
        templateUrl: require('formMCommons').buildUrl('form-m/search-form-m-service/search-form-m-modal.html'),
        controller: 'SearchFormMServiceModalCtrl as searchFormMModal',
        inputs: {
          uiOptions: config.uiOptions
        }

      }).then(function(modal) {
        modal.element.dialog({
          dialogClass: 'no-close',
          modal: true,
          minWidth: 600,
          minHeight: 450,
          title: 'Search Form M'
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

app.controller('SearchFormMServiceModalCtrl', SearchFormMServiceModalCtrl)
SearchFormMServiceModalCtrl.$inject = [
  'uiOptions',
  'close',
  'resetForm',
  '$element',
  'getTypeAheadCustomer',
  'getTypeAheadCurrency'
]
function SearchFormMServiceModalCtrl(uiOptions, close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
  var vm = this

  vm.displayLcIssueUI = false

  if (uiOptions) {
    vm.displayLcIssueUI = uiOptions.displayLcIssueUI
  }

  initForm()
  function initForm() {
    vm.searchParams = {}
    vm.showLcIssueContainer = false
    vm.searchLcIssuesTitle = 'Search By Letter Of Credit Issues'
    vm.selectedLcIssues = {}
  }

  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
  function toggleShowLcIssueContainer() {
    vm.showLcIssueContainer = !vm.showLcIssueContainer

    vm.searchLcIssuesTitle = !vm.showLcIssueContainer ? 'Search By Letter Of Credit Issues' : 'Dismiss'
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
