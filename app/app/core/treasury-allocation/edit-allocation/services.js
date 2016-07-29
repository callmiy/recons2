"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation-service' )

app.factory( 'saveAllocation', saveAllocation )
saveAllocation.$inject = [ 'TreasuryAllocation' ]

function saveAllocation(TreasuryAllocation) {

  function save(allocation) {
    return TreasuryAllocation.put( allocation ).$promise
  }

  return save
}
