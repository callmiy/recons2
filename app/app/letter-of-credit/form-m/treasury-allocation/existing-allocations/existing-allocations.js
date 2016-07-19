"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'existing-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'ngTable',
  'consolidated-lc-bid-request'
] )

app.directive( 'existingAllocations', existingAllocationsDirective )

existingAllocationsDirective.$inject = []

function existingAllocationsDirective() {
  return {
    restrict: 'E',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/existing-allocations/existing-allocations.html' ),
    controller: 'ExistingAllocationsDirectiveController as existingAllocations',
    scope: true,
    bindToController: {
      allocationList: '='
    }
  }
}

app.controller( 'ExistingAllocationsDirectiveController', ExistingAllocationsDirectiveController )

ExistingAllocationsDirectiveController.$inject = [
  'NgTableParams',
  'attachBidsToAllocation'
]

function ExistingAllocationsDirectiveController(NgTableParams, attachBidsToAllocation) {
  var vm = this  // jshint -W040

  vm.allocationList = attachBidsToAllocation( vm.allocationList )
  vm.tableParams = new NgTableParams(
    { sorting: { ref: 'desc' }, count: 1000000 },
    { dataset: vm.allocationList, counts: [] }
  )
}
