"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )
var app = angular.module( 'display-allocations' )

app.factory( 'getAllocationsForBids', getAllocationsForBids )
getAllocationsForBids.$inject = [ 'TreasuryAllocation' ]

/** @namespace allocation.distribution_to_consolidated_bids */
/**
 * An allocation will have zero or more bids to which the allocation is distributed. If a bid is attached to an
 * allocation, it's also possible for the bid to be attached to a different allocation i.e. has it is possible for
 * an allocation to be shared among different bids, it is also possible for a single bid to get distribution from
 * more than one allocation. In this service, We take all bids attached to an allocation and retrieve all the
 * allocations to which the bids have been attached.
 * @returns {getForBids}
 */
function getAllocationsForBids(TreasuryAllocation) {

  /**
   *
   * @param {{}} allocation
   * @returns {Array}
   */
  function getForBids(allocation) {

    return TreasuryAllocation.query( {
      consolidated_bids: underscore.pluck( allocation.distribution_to_consolidated_bids, 'id' ).join( ',' )

    } ).$promise
  }

  return getForBids
}
