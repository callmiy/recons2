"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation-service', [ 'rootApp' ] )

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
