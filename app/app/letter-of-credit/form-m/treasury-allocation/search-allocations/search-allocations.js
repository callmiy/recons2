"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'search-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'existing-allocations',
  'ngTable',
  'consolidated-lc-bid-request',
  'spinner-modal'
] )

app.directive( 'searchAllocations', searchAllocationsDirective )

searchAllocationsDirective.$inject = []

function searchAllocationsDirective() {
  return {
    restrict: 'AE',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/search-allocations/search-allocations.html' ),
    scope: false,
    controller: 'SearchAllocationsDirectiveController as searchAllocations'
  }
}

app.controller( 'SearchAllocationsDirectiveController', SearchAllocationsDirectiveController )

SearchAllocationsDirectiveController.$inject = [
  'searchTreasuryAllocation',
  'spinnerModal'
]

function SearchAllocationsDirectiveController(searchTreasuryAllocation, spinnerModal) {
  var vm = this  // jshint -W040
  vm.spinnerName = 'searchingAllocationsSpinner'
  vm.isAllocationSearchOpen = true
  vm.search = {}

  vm.datePickerIsOpenFor = {
    startDate: false,
    endDate: false
  }

  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.openDatePickerFor = function openDatePickerFor(element) {
    vm.datePickerIsOpenFor[ element ] = true
  }

  vm.doSearch = function doSearch(searchObj) {
    vm.showSearchResult = false

    if ( searchObj === 'reset' ) {
      vm.search = {}
      return
    }

    var spinner = spinnerModal( 'Fetching allocations.....please wait...' )
    searchTreasuryAllocation( searchObj ).then( function (data) {
      if ( data.length ) {
        vm.allocationList = data
        vm.showSearchResult = true
        vm.isAllocationSearchOpen = false
      }
    } ).finally( function () {
      spinner.dismiss()
    } )
  }
}
