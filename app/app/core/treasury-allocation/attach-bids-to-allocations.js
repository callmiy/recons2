"use strict";

/*jshint camelcase:false*/

/**
 *
 * @param {[]} allocationList
 * @return {*}
 */
function attachBidsToAllocation(allocationList) {

  var distributionToBids,
    totalAllocations,
    originalRequests,
    bidIds,
    outstandingAmounts,
    newOutstandingAmounts,
    originalRequestsEdited // we keep track of whether the bid is deleted i.e user decides the bid should not be
  // mapped to the allocation

  return allocationList.map( function (allocation) {
    distributionToBids = allocation.distribution_to_consolidated_bids

    if ( distributionToBids.length === 0 ) return allocation

    originalRequests = []
    bidIds = []
    totalAllocations = []
    outstandingAmounts = []
    newOutstandingAmounts = []
    originalRequestsEdited = []

    distributionToBids.forEach( function (bid) {
      totalAllocations.push( bid.sum_allocations )
      originalRequests.push( bid.sum_bid_requests )
      bidIds.push( bid.id )
      outstandingAmounts.push( bid.outstanding_amount )
      newOutstandingAmounts.push( bid.outstanding_amount )
      originalRequestsEdited.push( null )
    } )

    allocation.originalRequests = originalRequests
    allocation.totalAllocations = totalAllocations
    allocation.outstandingAmounts = outstandingAmounts
    allocation.newOutstandingAmounts = newOutstandingAmounts
    allocation.bidIds = bidIds
    allocation.originalRequestsEdited = originalRequestsEdited

    return allocation
  } )
}

module.exports = attachBidsToAllocation
