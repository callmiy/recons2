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
   * Given a string
   *
   * @param {String} query
   * @param {undefined|Array} fields
   * @returns {*}
   */
  function doGetConsolidatedLcBidRequest(query, fields) {

    return ConsolidatedLcBidRequest.getPaginated( { q: query } ).$promise.then( function (data) {
      var results = data.results,
        obj

      if ( fields ) {
        results = results.map( function (item) {
          obj = {}

          fields.forEach( function (field) {
            obj[ field ] = item[ field ]
          } )

          return obj
        } )
      }

      return results
    } )
  }

  return doGetConsolidatedLcBidRequest
}
