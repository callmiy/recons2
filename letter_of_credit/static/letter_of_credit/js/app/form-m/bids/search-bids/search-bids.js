"use strict";

/*jshint camelcase:false*/

var app = angular.module('search-bids', [
  'customer',
  'lc-bid-request',
  'rootApp'
])

app.directive('searchBids', searchBidsDirective)

searchBidsDirective.$inject = []

function searchBidsDirective() {
  return {
    restrict: 'AE',
    template: require('./search-bids.html'),
    scope: true,
    bindToController: {
      onBidsSearched: '&'
    },
    controller: 'searchBidsController as searchBids'
  }
}

app.controller('searchBidsController', searchBidsController)
searchBidsController.$inject = [
  'LcBidRequest',
  'underscore',
  'getTypeAheadCustomer',
  'getTypeAheadCurrency',
  'resetForm2',
  'toISODate'
]
function searchBidsController(LcBidRequest, underscore, getTypeAheadCustomer, getTypeAheadCurrency, resetForm2,
  toISODate) {
  var vm = this //jshint -W040

  init()
  function init() {
    vm.searchParams = {
      pending: false
    }
  }

  vm.toggleShow = function toggleShow(form) {
    vm.showForm = !vm.showForm

    if (!vm.showForm) vm.clearForm(form)
  }

  vm.validators = {
    applicant: {
      test: function () {
        return underscore.isObject(vm.searchParams.applicant)
      }
    },

    currency: {
      test: function () {
        return underscore.isObject(vm.searchParams.currency)
      }
    }
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

  vm.searchBids = function searchBids(searchParams) {
    var params = angular.copy(searchParams)
    params.applicant = params.applicant ? /\d+$/.exec(params.applicant.url)[0] : null
    params.currency = params.currency ? params.currency.code : null
    params.created_at = params.created_at ? toISODate(params.created_at) : null

    if (!params.pending) delete params.pending

    LcBidRequest.getPaginated(params).$promise.then(function (data) {
      vm.onBidsSearched({searchResult: data})
    })
  }
}
