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
  'NgTableParams',
  'ConsolidatedLcBidRequest'
]

function ExistingAllocationsDirectiveController(underscore, toISODate, TreasuryAllocation, NgTableParams,
                                                ConsolidatedLcBidRequest) {
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

        getAttachedBids( data )
      }
    } )
  }

  /**
   *
   * @param {[]} allocations
   * @return {{}}
   */
  function mapBidIdsToAllocation(allocations) {
    var bidIdAllocationMapping = {},
      idRegexp = new RegExp( "/(\\d+)/?$" ),
      bidIds = [],
      bidId,
      bids,
      allocationId,
      allocationsArray

    allocations.forEach( function (allocation) {
      bids = allocation.consolidated_bids

      if ( !bids.length ) return

      allocationId = allocation.id

      bids.forEach( function (url) {
        bidId = idRegexp.exec( url )[ 1 ]
        bidIds.push( bidId )

        if ( !underscore.has( bidIdAllocationMapping, bidId ) ) bidIdAllocationMapping[ bidId ] = [ allocationId ]

        else {
          allocationsArray = bidIdAllocationMapping[ bidId ]
          bidIdAllocationMapping[ bidId ] = allocationsArray.concat( [ allocationId ] )
        }
      } )

    } )

    return {
      mapping: bidIdAllocationMapping, bidIds: bidIds
    }
  }

  /**
   *
   * @param {[]} allocations
   * @param {[]} bids
   * @param {{}} mapping
   * @return {[]}
   */
  function mapAllocationsToBids(allocations, bids, mapping) {
    throw new Error( 'for every allocation that has associated bids, attach those bids to the allocation' )
  }

  /**
   *
   * @param {[]} allocations
   */
  function getAttachedBids(allocations) {
    var mappingIds = mapBidIdsToAllocation( allocations ),
      mapping = mappingIds.mapping,
      bidIds = mappingIds.bidIds

    ConsolidatedLcBidRequest
      .getPaginated( { pk: bidIds.join( ',' ), num_rows: 1000 } )
      .$promise.then( function (bids) {

      mapAllocationsToBids( allocations, bids, mapping )

    }, function (xhr) {
      console.log( xhr )
    } )
  }
}
