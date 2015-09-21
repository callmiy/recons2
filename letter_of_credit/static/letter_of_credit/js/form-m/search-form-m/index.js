"use strict";
/*jshint camelcase:false*/

var app = angular.module('form-m')

app.directive('searchFormM', searchFormMDirective)
searchFormMDirective.$inject = ['ModalService', 'kanmiiUnderscore']
function searchFormMDirective(ModalService, kanmiiUnderscore) {
  return {
    restrict: 'A',

    link: function(scope, elm, attributes, self) {
      elm
        .css({cursor: 'pointer'})
        .bind('click', function() {
                ModalService.showModal({
                  template: require('./search-form-m.html'),

                  controller: 'SearchFormMModalCtrl as searchFormMModal'

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
                      self.searchFormM(submittedSearchParams)
                    }
                  })
                })
              })
    },

    controller: 'SearchFormMDirectiveCtrl as searchFormM',

    scope: {},

    bindToController: {
      searchFormMResult: '='
    }
  }
}

app.controller('SearchFormMDirectiveCtrl', SearchFormMDirectiveCtrl)
SearchFormMDirectiveCtrl.$inject = []
function SearchFormMDirectiveCtrl() {
  var vm = this

  vm.searchFormM = searchFormM
  function searchFormM(submittedSearchParams) {
    console.log(submittedSearchParams);
  }
}

app.controller('SearchFormMModalCtrl', SearchFormMModalCtrl)
SearchFormMModalCtrl.$inject = ['close', 'resetForm', '$element', 'getTypeAheadCustomer', 'getTypeAheadCurrency']
function SearchFormMModalCtrl(close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
  var vm = this

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
    resetForm(form, element, 'form-control', initForm)
  }

  vm.submitSearchParams = submitSearchParams
  function submitSearchParams(searchParams) {
    close(searchParams)
  }

  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency
}
