"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation' )

app.factory( 'attachBidsToAllocation', attachBidsToAllocation )
attachBidsToAllocation.$inject = [
  'ConsolidatedLcBidRequest',
  'underscore',
  '$q'
]

function attachBidsToAllocation(ConsolidatedLcBidRequest, underscore, $q) {

  /**
   *
   * @param {[]} allocationList
   * @return {*}
   */
  function attach(allocationList) {
    var bidIdAmountMapping,
      deferred = $q.defer(),
      returned = []

    allocationList.forEach( function (allocation) {
      bidIdAmountMapping = allocation.distribution_to_consolidated_bids

      if ( underscore.isEmpty( bidIdAmountMapping ) ) {
        returned.push( allocation )
        return
      }

      var bids = []

      ConsolidatedLcBidRequest.getPaginated( { pk: underscore.keys( bidIdAmountMapping ).join( ',' ) } )
        .$promise.then( function (bidObj) {

        bidObj.results.forEach( function (bid) {
          bids.push( bid )
        } )

        allocation.bids = bids

      } ).finally( function () {
        returned.push( allocation )
      } )
    } )

    deferred.resolve( returned )

    return deferred.promise
  }

  return attach
}
