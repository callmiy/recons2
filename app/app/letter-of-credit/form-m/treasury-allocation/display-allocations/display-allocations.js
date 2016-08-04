"use strict";

/*jshint camelcase:false*/

var utilities = require( './utilities.js' )
var stateStore = require( './store-state.js' )
var getByKey = require( './../../../../core/get-by-key.js' )

var app = angular.module( 'display-allocations', [
  'treasury-allocation-service',
  'ngTable'
] )

app.directive( 'singleAllocationAction', singleAllocationAction )
function singleAllocationAction() {
  function link($scope, $elm, attrs, ngModelCtrl) {
    $scope.$on( '$destroy', function () {
      ngModelCtrl.$modelValue = null
    } )
  }

  return {
    restrict: 'A',
    require: '^^ngModel',
    link: link
  }
}

app.directive( 'displayAllocations', displayAllocationsDirective )

displayAllocationsDirective.$inject = []

function displayAllocationsDirective() {
  return {
    restrict: 'E',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/display-allocations/display-allocations.html' ),
    controller: 'DisplayAllocationsDirectiveController as displayAllocations',
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

app.controller( 'DisplayAllocationsDirectiveController', DisplayAllocationsDirectiveController )

DisplayAllocationsDirectiveController.$inject = [
  '$log',
  'NgTableParams',
  'getAllocationsForBids',
  '$scope',
  'formMAppStore'
]

function DisplayAllocationsDirectiveController($log, NgTableParams, getAllocationsForBids, $scope, formMAppStore) {
  var vm = this  // jshint -W040
  var oldFilter = {}

  //throw new Error( 'finish state restoration codes' )
  //:TODO finish code for destroying model when single action option is showing e.g edit

  vm.allocationList = utilities.attachBidsToAllocations( vm.allocationList )
  stateStore.setState(
    $scope.$parent.treasuryAllocation.displayAllocationParams, vm, oldFilter, NgTableParams
  )

  vm.doAction = function doAction(action) {
    switch ( action ) {
      case 'edit':
      {
        vm.editAllocation()
        break
      }
    }
  }

  vm.editAllocation = function editAllocation() {
    var allocation = getByKey( vm.tableParams.data, 'id', vm.selectedIds[ 0 ] )
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

  vm.isChecked = function isChecked(allocation) {
    return vm.selectedAllocations[ allocation.id ]
  }

  $scope.$on( 'init-display', function () {
    $scope.$parent.treasuryAllocation.displayAllocationParams = {}
  } )

  $scope.$watch( function () {
    return vm.selectedAllocations

  }, function (selections) {
    vm.selectedIds = utilities.getSelectedIds( selections )

  }, true )

  $scope.$watch(
    stateStore.getParams( vm, oldFilter ),
    stateStore.onParamsChanged( vm, oldFilter, formMAppStore ),
    true
  )
}
