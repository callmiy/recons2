"use strict";

/*jshint camelcase:false*/

var attachBidsToAllocation = require( './../../../../core/treasury-allocation/attach-bids-to-allocations.js' )
//var getByKey = require( './../../../../core/get-by-key.js' )
var utilities = require( './utilities.js' )

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
  '$log',
  'NgTableParams'
]

function ExistingAllocationsDirectiveController($log, NgTableParams) {
  var vm = this  // jshint -W040
  var oldFilter = {}

  //:TODO 'finish state restoration codes

  vm.allocationList = attachBidsToAllocation( vm.allocationList )
  vm.tableParams = new NgTableParams(
    { sorting: { ref: 'desc' } },
    { dataset: vm.allocationList }
  )

  vm.editAllocation = function editAllocation(allocation) {
    vm.allocationToEdit = allocation
    vm.showEditAllocationForm = true
    oldFilter = angular.copy( vm.tableParams.filter() )
    vm.tableParams.filter( { deal_number: allocation.deal_number } )
  }

  throw new Error( 'insert edited allocation into tableparams properly' )
  vm.onAllocationEdited = function onAllocationEdited(allocation, edited) {
    if ( edited ) {
      vm.tableParams.data = utilities.insertAllocation( allocation, vm.tableParams.data )
      console.log( 'vm.tableParams.data = ', vm.tableParams.data )
    }

    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
    vm.tableParams.filter( angular.copy( oldFilter ) )
    oldFilter = {}
  }
}


