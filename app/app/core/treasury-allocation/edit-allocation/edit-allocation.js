"use strict";

/*jshint camelcase:false*/

var utilities = require( './utilities.js' )
var app = angular.module( 'treasury-allocation-service' )

app.directive( 'editAllocation', editAllocationDirective )
editAllocationDirective.$inject = []

function editAllocationDirective() {

  return {
    restrict: 'AE',
    templateUrl: require( 'commons' ).buildUrl( 'core', 'treasury-allocation/edit-allocation/edit-allocation.html' ),
    scope: true,
    bindToController: {
      allocation: '=',
      kmTitle: '=',
      onEdited: '&'
    },
    controller: 'editAllocationController as editAllocation'
  }
}

app.controller( 'editAllocationController', editAllocationController )
editAllocationController.$inject = [
  '$log',
  'saveAllocation',
  'getConsolidatedLcBidRequest'
]

function editAllocationController($log, saveAllocation, getConsolidatedLcBidRequest) {
  var vm = this //jshint -W040
  vm.allocation = angular.copy( vm.allocation ) //we should not mutate the original allocation
  vm.bids = utilities.formatBids( vm.allocation.distribution_to_consolidated_bids )
  var originalBids = angular.copy( vm.bids ) //we store the original bids in case user hits cancel button

  vm.getBids = function getBids(query) {
    return getConsolidatedLcBidRequest( query, function transformRawBids(bids) {
      return utilities.transformRawBids( bids, utilities.bidAttributes )
    } )
  }

  throw new Error( 'figure out how to set bid.ref model to a string and the bid should be the result of type ahead' )
  vm.bidRefGetterSetter = function bidRefGetterSetter(val) {
    if ( !arguments.length ) return null

  }

  vm.save = function save(bids) {
    utilities.bidsChanged( bids, originalBids )
  }

  vm.addBid = function addBid() {
    vm.bids = utilities.addBid( vm.bids, vm.allocation.fcy_amount )
  }

  /**
   *
   * @param {Number} index
   */
  vm.removeBid = function removeBid(index) {
    vm.bids = utilities.removeBid( vm.bids, index )
  }

  /**
   *
   * @param {String} type
   */
  vm.exit = function exit(type) {
    if ( type === 'dismiss' ) vm.allocation.distribution_to_consolidated_bids = originalBids

    vm.onEdited( { allocation: vm.allocation } )
  }
}
