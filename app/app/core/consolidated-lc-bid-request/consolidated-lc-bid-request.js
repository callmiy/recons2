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
