"use strict";

/*jshint camelcase:false*/

var stateStore = require( './store-state.js' )

var app = angular.module( 'search-allocations', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'display-allocations',
  'ngTable',
  'consolidated-lc-bid-request',
  'spinner-modal'
] )

app.directive( 'searchAllocations', searchAllocationsDirective )

searchAllocationsDirective.$inject = [ 'formMAppStore' ]

function searchAllocationsDirective(formMAppStore) {
  function link(scope, $elm, attrs, ctrl) {
    scope.$on( '$destroy', function () {
      stateStore.storeSate( ctrl, formMAppStore )
    } )
  }

  return {
    restrict: 'AE',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/search-allocations/search-allocations.html' ),
    scope: false,
    controller: 'SearchAllocationsDirectiveController as searchAllocations',
    link: link
  }
}

app.controller( 'SearchAllocationsDirectiveController', SearchAllocationsDirectiveController )

SearchAllocationsDirectiveController.$inject = [
  'searchTreasuryAllocation',
  'spinnerModal',
  '$scope'
]

function SearchAllocationsDirectiveController(searchTreasuryAllocation, spinnerModal, $scope) {
  var vm = this  // jshint -W040
  vm.spinnerName = 'searchingAllocationsSpinner'
  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.datePickerIsOpenFor = {
    startDate: false,
    endDate: false
  }

  stateStore.setState( $scope.$parent.treasuryAllocation.searchAllocationParams, vm )

  vm.openDatePickerFor = function openDatePickerFor(element) {
    vm.datePickerIsOpenFor[ element ] = true
  }

  vm.doSearch = function doSearch(searchObj) {
    vm.showSearchResult = false
    vm.allocationList = null

    $scope.$broadcast( 'init-display', 'init' )

    if ( searchObj === 'reset' ) {
      vm.search = {}
      return
    }

    var spinner = spinnerModal( 'Fetching allocations...' )
    searchTreasuryAllocation( searchObj ).then( function (data) {
      if ( data.length ) {
        vm.allocationList = data
        vm.showSearchResult = true
        vm.isAllocationSearchOpen = false
      }
    } ).finally( function () {
      spinner.dismiss()
    } )
  }
}
