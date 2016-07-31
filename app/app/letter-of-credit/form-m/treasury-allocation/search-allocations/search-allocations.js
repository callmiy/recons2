"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'search-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'existing-allocations',
  'angularSpinner',
  'ngTable',
  'consolidated-lc-bid-request'
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
  'usSpinnerService'
]

function SearchAllocationsDirectiveController(searchTreasuryAllocation, usSpinnerService) {
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

    usSpinnerService.spin( vm.spinnerName )
    searchTreasuryAllocation( searchObj ).then( function (data) {
      if ( data.length ) {
        vm.allocationList = data
        vm.showSearchResult = true
        vm.isAllocationSearchOpen = false
      }
    } ).finally( function () {
      usSpinnerService.stop( vm.spinnerName )
    } )
  }
}
