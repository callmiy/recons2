"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'existing-allocations', [
  'treasury-allocation-service',
  'ngTable'
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
    { sorting: { ref: 'desc' } },
    { dataset: vm.allocationList }
  )
}
