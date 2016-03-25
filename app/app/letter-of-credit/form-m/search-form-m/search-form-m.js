"use strict";

/*jshint camelcase:false*/

var app = angular.module('search-form-m', [
  'customer',
  'form-m-service',
  'rootApp',
  'complex-object-validator'
])

app.directive('searchMf', searchMfDirective)

searchMfDirective.$inject = []

  function searchMfDirective() {
  return {
    restrict: 'AE',
    template: require('./search-form-m.html'),
    scope: true,
    bindToController: {
      onMfSearch: '&'
    },
    controller: 'searchFormMController as searchMf'
  }
}

app.controller('searchFormMController', searchFormMController)
searchFormMController.$inject = [
  'FormM',
  'underscore',
  'getTypeAheadCustomer',
  'getTypeAheadCurrency',
  'resetForm2',
  'toISODate'
]
function searchFormMController(FormM, underscore, getTypeAheadCustomer, getTypeAheadCurrency, resetForm2,
  toISODate) {
  var vm = this //jshint -W040
  vm.showForm = true

  init()
  function init() {
    vm.searchParams = {
      cancelled: false
    }
  }

  vm.toggleShow = function toggleShow(form) {
    vm.showForm = !vm.showForm

    if (!vm.showForm) vm.clearForm(form)
  }

  vm.getCurrency = getTypeAheadCurrency
  vm.getApplicant = getTypeAheadCustomer
  vm.datePickerIsOpen = false
  vm.openDatePicker = function openDatePicker() {
    vm.datePickerIsOpen = true
  }

  vm.clearForm = function clearForm(form) {
    resetForm2(form)
    init()
  }

  vm.searchMf = function searchMf(searchParams) {
    var params = angular.copy(searchParams)
    params.applicant_id = params.applicantObj ? /\d+$/.exec(params.applicantObj.url)[0] : null
    params.currency = params.currency ? params.currency.code : null
    params.created_at = params.created_at ? toISODate(params.created_at) : null

    if (!params.cancelled) delete params.cancelled

    FormM.getPaginated(params).$promise.then(function (data) {
      vm.onMfSearch({searchResult: data})
    })
  }
}
