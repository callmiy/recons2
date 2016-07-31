"use strict";

/*jshint camelcase:false*/

/**
 *
 * @param {{}} allocation
 * @param {Array} allocationList
 * @returns {Array}
 */
function replaceAllocation(allocation, allocationList) {
  return allocationList.map( function (alloc) {
    /** @namespace allocation.id */
    if ( alloc.id === allocation.id ) return allocation
    return alloc
  } )

}

/**
 *
 * @param {{}} allocation
 * @param {Array} allocation.distribution_to_consolidated_bids
 * @returns {{}}
 */
function attachBidsToAllocation(allocation) {
  var distributionToBids = allocation.distribution_to_consolidated_bids

  if ( distributionToBids.length === 0 ) return allocation

  var originalRequests = []
  var totalAllocations = []
  var outstandingAmounts = []
  var originalRequestsEdited = []

  distributionToBids.forEach( function (bid) {
    totalAllocations.push( bid.sum_allocations )
    originalRequests.push( bid.sum_bid_requests )
    outstandingAmounts.push( bid.outstanding_amount )
    originalRequestsEdited.push( null )
  } )

  allocation.originalRequests = originalRequests
  allocation.totalAllocations = totalAllocations
  allocation.outstandingAmounts = outstandingAmounts
  allocation.originalRequestsEdited = originalRequestsEdited

  return allocation
}

/**
 *
 * @param {Array} allocationList
 * @return {Array}
 */
function attachBidsToAllocations(allocationList) {
  return allocationList.map( function (allocation) {
    return attachBidsToAllocation( allocation )
  } )
}

module.exports = {
  replaceAllocation: replaceAllocation,
  attachBidsToAllocations: attachBidsToAllocations,
  attachBidsToAllocation: attachBidsToAllocation
}
