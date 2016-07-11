"use strict";

/*jshint camelcase:false*/

require( './upload-allocation/upload-allocation.js' )
require( './download-bids/download-bids.js' )
require( './existing-allocations/existing-allocations.js' )

var app = angular.module( 'treasury-allocation', [
  'ui.router',
  'upload-treasury-allocation',
  'allocation-download-bids',
  'existing-allocations',
  'rootApp'
] )

app.factory( 'collateBidRequests', collateBidRequests )
collateBidRequests.$inject = [ 'underscore' ]
function collateBidRequests(underscore) {

  /**
   * collect all bid requests with same mf number into an array and then return an object with mf number as key and
   * array of bids associated with that mf as value
   * @param {[]} bids
   * @return {{}}
   */
  function collate(bids) {
    var result = {},
      mf,
      amount,
      previousAllocations,
      previousOutstandings,
      current

    bids.forEach( function (bid) {
      mf = bid.form_m_number
      amount = Number( bid.sum_bid_requests )
      previousAllocations = Number( bid.sum_allocations )
      previousOutstandings = Number( bid.outstanding_amount )

      if ( !underscore.has( result, mf ) ) {
        result[ mf ] = {
          original_requests: [ amount ],
          previous_allocations: [ previousAllocations ],
          previous_outstandings: [ previousOutstandings ],
          bid_ids: [ bid.id ],
          original_requests_deleted: [ null ]
        }
      }
      else {
        current = result[ mf ]
        current.original_requests.push( amount )
        current.previous_outstandings.push( previousOutstandings )
        current.previous_allocations.push( previousAllocations )
        current.bid_ids.push( bid.id )
        current.original_requests_deleted.push( null )
        result[ mf ] = current
      }
    } )

    return result
  }

  return collate
}

app.config( treasuryAllocationConfig )
treasuryAllocationConfig.$inject = [ '$stateProvider' ]
function treasuryAllocationConfig($stateProvider) {
  $stateProvider
    .state( 'form_m.treasury_allocation', {

      kanmiiTitle: 'Allocations',

      params: {
        uploadAllocationParams: {},
        treasuryAllocationParams: {}
      },

      views: {
        treasuryAllocation: {
          template: require( './treasury-allocation.html' ),

          controller: 'TreasuryAllocationController as treasuryAllocation'
        }
      }
    } )
}

app.controller( 'TreasuryAllocationController', TreasuryAllocationController )
TreasuryAllocationController.$inject = [
  '$stateParams',
  '$scope',
  'formMAppStore'
]

function TreasuryAllocationController($stateParams, $scope, formMAppStore) {
  var vm = this

  vm.uploadAllocationParams = $stateParams.uploadAllocationParams

  var treasuryAllocationParams = $stateParams.treasuryAllocationParams

  vm.action = treasuryAllocationParams.action

  function getParams() {
    return {
      action: vm.action
    }
  }

  function onParamsChanged() {
    formMAppStore.treasuryAllocation.treasuryAllocationParams = {
      action: vm.action
    }
  }

  $scope.$watch( getParams, onParamsChanged, true )
}
