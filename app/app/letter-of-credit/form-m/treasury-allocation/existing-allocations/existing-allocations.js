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
  'underscore',
  'toISODate',
  'searchTreasuryAllocation',
  'NgTableParams',
  'ConsolidatedLcBidRequest',
  'getByKey',
  '$q',
  'attachBidsToAllocation'
]

function ExistingAllocationsDirectiveController(underscore, toISODate, searchTreasuryAllocation, NgTableParams,
                                                ConsolidatedLcBidRequest, getByKey, $q, attachBidsToAllocation) {
  var vm = this  // jshint -W040

  attachBidsToAllocation( angular.copy( vm.allocationList ) ).then( function (allocations) {
    vm.allocationList = allocations

    vm.tableParams = new NgTableParams(
      { sorting: { ref: 'desc' }, count: 1000000 },
      { dataset: vm.allocationList, counts: [] }
    )

  } ).finally( function () {
    //vm.tableParams.dataset = vm.allocationList
  } )

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
    var allocationIds,
      bidId,
      allocation

    bids.forEach( function (bid) {
      bidId = bid.id

      if ( underscore.has( mapping, bidId ) ) {
        allocationIds = mapping[ bidId ]
        allocationIds.forEach( function (allocationId) {
          allocation = getByKey( allocations, 'id', allocationId )

          if ( allocation ) {
            allocations[ allocations.indexOf( allocation ) ] = attachBidToAllocation( allocation, bid )
          }
        } )
      }
    } )

    return allocations
  }

  /**
   * For every bid deemed mapped to allocation, insert the bid original requests, previous allocations and outstandings
   * @param {{}} allocation
   * @param {{}} bid
   * @return {{}}
   */
  function attachBidToAllocation(allocation, bid) {
    var amount = Number( bid.sum_bid_requests ),
      previousAllocations = Number( bid.sum_allocations ),
      previousOutstandings = Number( bid.outstanding_amount ),
      allocatedAmount = Number( allocation.fcy_amount ),
      bidId = bid.id

    // we will always make sales allocation a negative number
    if ( allocation.transaction_type.toLowerCase() === 'sale' ) allocatedAmount = -1 * allocatedAmount

    if ( !underscore.has( allocation, 'original_requests' ) ) allocation.original_requests = [ amount ]
    else allocation.original_requests.push( amount )

    if ( !underscore.has( allocation, 'previous_allocations' ) ) allocation.previous_allocations = [ previousAllocations ]
    else allocation.previous_allocations.push( previousAllocations )

    if ( !underscore.has( allocation, 'previous_outstandings' ) ) allocation.previous_outstandings = [ previousOutstandings ]
    else allocation.previous_outstandings.push( previousOutstandings )

    if ( !underscore.has( allocation, 'current_outstandings' ) ) {
      allocation.current_outstandings = [ previousOutstandings ]

    } else allocation.current_outstandings.push( previousOutstandings )

    if ( !underscore.has( allocation, 'bid_ids' ) ) allocation.bid_ids = [ bidId ]
    else allocation.bid_ids.push( bid.id )

    if ( !underscore.has( allocation, 'original_requests_deleted' ) ) allocation.original_requests_deleted = [ null ]
    else allocation.original_requests_deleted.push( null )

    return allocation
  }

  /**
   *
   * @param {[]} allocations
   */
  function getAttachedBids(allocations) {
    var mappingIds = mapBidIdsToAllocation( allocations ),
      mapping = mappingIds.mapping,
      bidIds = mappingIds.bidIds,
      deferred = $q.defer()

    ConsolidatedLcBidRequest
      .getPaginated( { pk: bidIds.join( ',' ), num_rows: 1000 } )
      .$promise.then( function (data) {

      if ( data.count ) deferred.resolve( mapAllocationsToBids( allocations, data.results, mapping ) )
      deferred.resolve( allocations )

    }, function (xhr) {
      deferred.reject( xhr )
    } )

    return deferred.promise
  }
}
