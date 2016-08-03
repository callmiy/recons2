"use strict";

/*jshint camelcase:false*/

var utilities = require( './utilities.js' )
var stateStore = require( './store-state.js' )

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
    },
    link: function (scope) {
      scope.$on( '$destroy', function () {
        //console.log( 'destroy  = ', 'destroy' )
      } )
    }
  }
}

app.controller( 'ExistingAllocationsDirectiveController', ExistingAllocationsDirectiveController )

ExistingAllocationsDirectiveController.$inject = [
  '$log',
  'NgTableParams',
  'getAllocationsForBids',
  '$scope',
  'formMAppStore'
]

function ExistingAllocationsDirectiveController($log, NgTableParams, getAllocationsForBids, $scope, formMAppStore) {
  var vm = this  // jshint -W040
  var oldFilter = {}

  throw new Error( 'finish state restoration codes' )
  //:TODO 'finish state restoration codes

  vm.allocationList = utilities.attachBidsToAllocations( vm.allocationList )
  stateStore.setState(
    $scope.$parent.treasuryAllocation.existingAllocationParams, vm, oldFilter, NgTableParams
  )
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

  vm.onAllocationEdited = function onAllocationEdited(allocation, edited) {

    if ( edited ) {
      getAllocationsForBids( allocation ).then( function (allocations) {
        vm.tableParams.settings( {
          dataset: utilities.replaceAllocations(
            utilities.attachBidsToAllocations( allocations ), vm.tableParams.settings().dataset
          )
        } )
      } )
    }

    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
    vm.tableParams.filter( angular.copy( oldFilter ) )
    oldFilter = {}
  }

  $scope.$on( 'init-display', function () {
    $scope.$parent.treasuryAllocation.existingAllocationParams = {}
  } )

  $scope.$watch(
    stateStore.getParams( vm, oldFilter ),
    stateStore.onParamsChanged( vm, oldFilter, formMAppStore ),
    true
  )
}
