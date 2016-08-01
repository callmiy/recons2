"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )

/**
 *
 * @param {Array} allocations
 * @param {Array} allocationList
 * @returns {Array}
 */
function replaceAllocations(allocations, allocationList) {
  var allocId,
    obj = {}

  allocations.forEach( function (allocation) {
    obj[ allocation.id ] = allocation
  } )

  return allocationList.map( function (alloc) {
    allocId = alloc.id
    /** @namespace allocation.id */
    if ( underscore.has( obj, allocId ) ) return obj[ allocId ]
    return alloc
  } )

}

/** @namespace bid.sum_allocations */
/** @namespace bid.sum_bid_requests */
/** @namespace bid.outstanding_amount */
/**
 *
 * @param {{}} allocation
 * @param {Array} allocation.distribution_to_consolidated_bids
 * @param {Array} allocation.originalRequests
 * @param {Array} allocation.totalAllocations
 * @param {Array} allocation.outstandingAmounts
 * @param {Array} allocation.originalRequestsFormsM
 * @param {Array} allocation.distributions
 * @returns {{}}
 */
function attachBidsToAllocation(allocation) {
  var distributionToBids = allocation.distribution_to_consolidated_bids

  if ( distributionToBids.length === 0 ) return allocation

  var originalRequests = []
  var totalAllocations = []
  var outstandingAmounts = []
  var originalRequestsFormsM = []
  var distributions = []

  distributionToBids.forEach( function (bid) {
    totalAllocations.push( bid.sum_allocations )
    originalRequests.push( bid.sum_bid_requests )
    outstandingAmounts.push( bid.outstanding_amount )
    originalRequestsFormsM.push( bid.form_m_number )
    distributions.push( bid.portion_of_allocation )
  } )

  allocation.originalRequests = originalRequests
  allocation.totalAllocations = totalAllocations
  allocation.outstandingAmounts = outstandingAmounts
  allocation.originalRequestsFormsM = originalRequestsFormsM
  allocation.distributions = distributions

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
  replaceAllocations: replaceAllocations,
  attachBidsToAllocations: attachBidsToAllocations,
  attachBidsToAllocation: attachBidsToAllocation
}
