"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation-service', [
  'rootApp',
  'consolidated-lc-bid-request'
] )

app.factory( 'TreasuryAllocation', TreasuryAllocation )
TreasuryAllocation.$inject = [ '$resource', 'urls' ]

function TreasuryAllocation($resource, urls) {
  var url = appendToUrl( urls.treasuryAllocationAPIUrl, ':id' );
  return $resource( url, { id: '@id' }, {
      'put': {
        method: 'PUT'
      },

      getPaginated: {
        method: 'GET'
      },

      saveMany: {
        method: 'POST', isArray: true
      }
    }
  )
}

app.factory( 'getTypeAheadTreasuryAllocation', getTypeAheadTreasuryAllocation )
getTypeAheadTreasuryAllocation.$inject = [ 'TreasuryAllocation', '$q' ]

function getTypeAheadTreasuryAllocation(TreasuryAllocation, $q) {

  function getTreasuryAllocation(query) {
    var deferred = $q.defer()
    TreasuryAllocation.getPaginated( query ).$promise.then( function (data) {
      deferred.resolve( data.results )

    }, function (xhr) {
      deferred.reject( xhr )
    } )

    return deferred.promise
  }

  return getTreasuryAllocation
}

app.factory( 'searchTreasuryAllocation', searchTreasuryAllocation )
searchTreasuryAllocation.$inject = [ 'TreasuryAllocation', 'toISODate', 'underscore' ]

function searchTreasuryAllocation(TreasuryAllocation, toISODate, underscore) {
  function search(searchObj) {

    var searchParams = {}

    if ( underscore.isObject( searchObj ) ) {
      if ( searchObj.startDate ) searchParams.deal_start_date = toISODate( searchObj.startDate )
      if ( searchObj.endDate ) searchParams.deal_end_date = toISODate( searchObj.endDate )
      if ( searchObj.ref ) searchParams.ref = searchObj.ref.trim()
      if ( searchObj.dealNo ) searchParams.deal_number = searchObj.dealNo.trim()
    }

    return TreasuryAllocation.query( searchParams ).$promise

  }

  return search
}
