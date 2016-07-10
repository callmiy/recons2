"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'existing-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'ngTable'
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
  'toISODate',
  'TreasuryAllocation',
  'NgTableParams'
]

function ExistingAllocationsDirectiveController(underscore, toISODate, TreasuryAllocation, NgTableParams) {
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
    vm.showSearchResult = false

    if ( typeof searchObj === 'undefined' ) {
      vm.search = null
      return
    }

    var searchParams = {}

    if ( underscore.isObject( searchObj ) ) {
      if ( searchObj.startDate ) searchParams.deal_start_date = toISODate( searchObj.startDate )
      if ( searchObj.endDate ) searchParams.deal_end_date = toISODate( searchObj.endDate )
      if ( searchObj.ref ) searchParams.ref = searchObj.ref.trim()
      if ( searchObj.dealNo ) searchParams.deal_number = searchObj.dealNo.trim()
    }

    TreasuryAllocation.query( searchParams ).$promise.then( function (data) {
      if ( data.length ) {
        vm.tableParams = new NgTableParams( {}, { dataset: data } )
        vm.showSearchResult = true
      }
    } )
  }
}
