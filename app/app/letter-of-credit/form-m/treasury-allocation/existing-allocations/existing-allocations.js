"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'existing-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service'
] )

app.directive( 'existingAllocations', existingAllocationsDirective )

existingAllocationsDirective.$inject = []

function existingAllocationsDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/existing-allocations/existing-allocations.html' ),
    scope: false,
    controller: 'ExistingAllocationsDirectiveController as existingAllocations'
  }
}

app.controller( 'ExistingAllocationsDirectiveController', ExistingAllocationsDirectiveController )

ExistingAllocationsDirectiveController.$inject = [
  'underscore',
  'toISODate'
]

function ExistingAllocationsDirectiveController(underscore, toISODate) {
  var vm = this  // jshint -W040
  vm.isAllocationSearchOpen = true

  vm.datePickerIsOpenFor = {
    startDate: false,
    endDate: false
  }

  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.openDatePickerFor = function openDatePickerFor(element) {
    vm.datePickerIsOpenFor[ element ] = true
  }

  vm.doSearch = function doSearch(searchObj) {
    if ( typeof searchObj === 'undefined' ) {
      vm.search = null
      return
    }
    console.log( 'search = ', searchObj )
    if ( underscore.isEmpty( searchObj ) ) return
  }
}
