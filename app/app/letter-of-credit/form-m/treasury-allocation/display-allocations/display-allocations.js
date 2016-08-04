"use strict";

/*jshint camelcase:false*/

var utilities = require( './utilities.js' )
var stateStore = require( './store-state.js' )
var getByKey = require( './../../../../core/get-by-key.js' )

var app = angular.module( 'display-allocations', [
  'treasury-allocation-service',
  'ngTable'
] )

app.directive( 'kmNullModelOnDestroy', kmNullModelOnDestroy )
function kmNullModelOnDestroy() {
  function link(scope, $elm, attrs, ngModelCtrl) {

    scope.$on( '$destroy', function () {
      ngModelCtrl.$setViewValue( '' )
      ngModelCtrl.$modelValue = null
    } )
  }

  return {
    restrict: 'A',
    require: '^ngModel',
    link: link
  }
}

app.directive( 'displayAllocations', displayAllocationsDirective )

displayAllocationsDirective.$inject = [ 'formMAppStore' ]

function displayAllocationsDirective(formMAppStore) {
  function link(scope, $elm, attrs, ctrl) {
    scope.$on( '$destroy', function () {
      if ( ctrl.clearStore === true ) {
        formMAppStore.treasuryAllocation.displayAllocationParams = null
        return
      }

      stateStore.storeSate( ctrl, formMAppStore )
    } )
  }

  return {
    restrict: 'E',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/display-allocations/display-allocations.html' ),
    controller: 'DisplayAllocationsDirectiveController as displayAllocations',
    scope: true,
    bindToController: {
      allocationList: '='
    },
    link: link
  }
}

app.controller( 'DisplayAllocationsDirectiveController', DisplayAllocationsDirectiveController )

DisplayAllocationsDirectiveController.$inject = [
  '$log',
  'NgTableParams',
  'getAllocationsForBids',
  '$scope',
  'formMAppStore'
]

function DisplayAllocationsDirectiveController($log, NgTableParams, getAllocationsForBids, $scope) {
  var vm = this  // jshint -W040
  vm.oldFilter = {}

  //throw new Error( 'finish state restoration codes' )
  //:TODO finish code for destroying model when single action option is showing e.g edit

  vm.allocationList = utilities.attachBidsToAllocations( vm.allocationList )
  stateStore.restoreState(
    $scope.$parent.treasuryAllocation.displayAllocationParams, vm, NgTableParams
  )

  vm.doAction = function doAction(action) {
    switch ( action ) {
      case 'edit':
      {
        vm.editAllocation()
        break
      }

      case 'download':
      {
        vm.editAllocation()
        break
      }
    }
  }

  vm.download = function download() {

  }

  vm.editAllocation = function editAllocation() {
    var allocation = getByKey( vm.tableParams.data, 'id', vm.selectedIds[ 0 ] )
    vm.allocationToEdit = allocation
    vm.showEditAllocationForm = true
    vm.oldFilter = angular.copy( vm.tableParams.filter() )
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
    vm.tableParams.filter( angular.copy( vm.oldFilter ) )
    vm.oldFilter = {}
  }

  vm.isChecked = function isChecked(allocation) {
    return vm.selectedAllocations[ allocation.id ]
  }

  $scope.$on( 'init-display', function () {
    vm.clearStore = true
    $scope.$parent.treasuryAllocation.displayAllocationParams = {}
  } )

  $scope.$watch( function () {
    return vm.selectedAllocations

  }, function (selections) {
    vm.selectedIds = utilities.getSelectedIds( selections )

  }, true )
}
