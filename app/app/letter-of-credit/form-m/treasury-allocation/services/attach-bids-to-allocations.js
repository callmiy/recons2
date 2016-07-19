"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation' )

app.factory( 'attachBidsToAllocation', attachBidsToAllocation )
attachBidsToAllocation.$inject = []

function attachBidsToAllocation() {

  /**
   *
   * @param {[]} allocationList
   * @return {*}
   */
  function attach(allocationList) {
    var distributionToBids, totalAllocations, originalRequests, bidIds, outstandingAmounts, newOutstandingAmounts

    return allocationList.map( function (allocation) {
      distributionToBids = allocation.distribution_to_consolidated_bids

      if ( distributionToBids.length === 0 ) return allocation

      originalRequests = []
      bidIds = []
      totalAllocations = []
      outstandingAmounts = []
      newOutstandingAmounts = []

      distributionToBids.forEach( function (bid) {
        totalAllocations.push( bid.sum_allocations )
        originalRequests.push( bid.sum_bid_requests )
        bidIds.push( bid.id )
        outstandingAmounts.push( bid.outstanding_amount )
        newOutstandingAmounts.push( bid.outstanding_amount )
      } )

      allocation.originalRequests = originalRequests
      allocation.totalAllocations = totalAllocations
      allocation.outstandingAmounts = outstandingAmounts
      allocation.newOutstandingAmounts = newOutstandingAmounts
      allocation.bidIds = bidIds

      return allocation
    } )
  }

  return attach
}
