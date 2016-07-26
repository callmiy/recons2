"use strict";

/*jshint camelcase:false*/

var attachBidsToAllocation = require( './../../../../core/treasury-allocation/attach-bids-to-allocations.js' )
var initialState = require( './initial-state.js' )

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

  throw new Error( 'finish state restoration codes' )

  init( $scope.$parent.treasuryAllocation.existingAllocationParams )

  /**
   *
   * @param {{}} params
   */
  function init(params) {
    if ( underscore.isEmpty( params ) ) {
      underscore.each( initialState, function (val, attr) {
        vm[ attr ] = val
      } )

      vm.allocationList = attachBidsToAllocation( vm.allocationList )
      vm.tableParams = new NgTableParams(
        { sorting: { ref: 'desc' } },
        { dataset: vm.allocationList }
      )

    } else {
      underscore.each( initialState, function (val, attr) {
        vm[ attr ] = params[ attr ]
      } )
    }
  }

  vm.editAllocation = function editAllocation(allocation) {
    vm.allocationToEdit = allocation
    vm.showEditAllocationForm = true
    oldFilter = angular.copy( vm.tableParams.filter() )
    vm.tableParams.filter( { deal_number: allocation.deal_number } )
  }

  vm.onAllocationEdited = function onAllocationEdited(allocation) {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
    vm.tableParams.filter( angular.copy( oldFilter ) )
    oldFilter = {}
  }
}


