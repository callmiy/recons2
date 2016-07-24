"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'consolidated-lc-bid-request', [ 'rootApp' ] )

app.factory( 'ConsolidatedLcBidRequest', ConsolidatedLcBidRequest )

ConsolidatedLcBidRequest.$inject = [ '$resource', 'urls' ]

function ConsolidatedLcBidRequest($resource, urls) {
  var url = appendToUrl( urls.consolidatedLcBidRequestAPIUrl, ':id' );
  return $resource( url, { id: '@id' }, {
      put: {
        method: 'PUT'
      },

      patch: {
        method: 'PATCH'
      },

      getPaginated: {
        method: 'GET'
      }
    }
  )
}

app.factory( 'getConsolidatedLcBidRequest', getConsolidatedLcBidRequest )
getConsolidatedLcBidRequest.$inject = [ 'ConsolidatedLcBidRequest' ]

function getConsolidatedLcBidRequest(ConsolidatedLcBidRequest) {

  /**
   * Given a string which is the substring of form M or lc number of some consolidated bids, get the corresponding
   * consolidated bids and optionally transform the bids using transformFn
   *
   * @param {String} query
   * @param {undefined|Function} transformFn
   * @returns {*}
   */
  function doGetConsolidatedLcBidRequest(query, transformFn) {

    return ConsolidatedLcBidRequest.getPaginated( { q: query } ).$promise.then( function (data) {
      var results = data.results

      if ( transformFn ) results = transformFn( results )

      return results
    } )
  }

  return doGetConsolidatedLcBidRequest
}
