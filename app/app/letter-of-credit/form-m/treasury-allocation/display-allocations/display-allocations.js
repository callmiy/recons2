"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )
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
        formMAppStore.displayAllocationParams = null
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
  'NgTableParams',
  'getAllocationsForBids',
  '$scope',
  'urls',
  '$window',
  'formMAppStore'
]

function DisplayAllocationsDirectiveController(NgTableParams, getAllocationsForBids, $scope, urls, $window,
                                               formMAppStore) {
  var vm = this  // jshint -W040
  vm.oldFilter = {}

  vm.allocationList = utilities.attachBidsToAllocations( vm.allocationList )
  stateStore.restoreState( formMAppStore, vm, NgTableParams )

  vm.doAction = function doAction(action) {
    switch ( action ) {
      case 'edit':
      {
        vm.editAllocation()
        break
      }

      case 'download':
      {
        vm.download()
        break
      }

      case 'download-all':
      {
        vm.download( 'all' )
        break
      }
    }
  }

  /**
   *
   * @param all
   */
  vm.download = function download(all) {
    $window.location.href = utilities.getDownloadUrl(
      all ? underscore.pluck( vm.allocationList, 'id' ) : vm.selectedIds, urls
    )
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
  } )

  $scope.$watch( function () {
    return vm.selectedAllocations

  }, function (selections) {
    vm.selectedIds = utilities.getSelectedIds( selections )

  }, true )
}
