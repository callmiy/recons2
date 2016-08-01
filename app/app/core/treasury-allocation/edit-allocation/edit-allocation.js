"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )
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
  'getConsolidatedLcBidRequest',
  'editAllocationModal'
]

function editAllocationController($log, saveAllocation, getConsolidatedLcBidRequest, editAllocationModal) {
  var vm = this //jshint -W040
  vm.allocation = angular.copy( vm.allocation ) //we should not mutate the original allocation
  vm.bids = utilities.formatBids( vm.allocation.distribution_to_consolidated_bids )
  var originalBids = angular.copy( vm.bids ) //we store the original bids in case user hits cancel button

  vm.getBids = function getBids(query) {
    return getConsolidatedLcBidRequest( query, function transformRawBids(bids) {
      return utilities.transformRawBids( bids, utilities.bidAttributes )
    } )
  }

  vm.onSelectBid = function onSelectBid($item, $model) {
    vm.bids = utilities.transformSelectedBids( vm.bids, $model )
  }

  vm.save = function save(bids) {
    vm.errors = null
    var errors = utilities.getAllocationDistributionErrors( bids, originalBids, vm.allocation.fcy_amount )

    if ( errors.length ) {
      vm.errors = utilities.getErrorText( errors )
      return
    }

    vm.allocation.distribution_to_consolidated_bids = bids
    vm.allocation.consolidated_bids = underscore.pluck( bids, 'url' )

    saveAllocation( vm.allocation ).then( function (allocation) {
      vm.exit( allocation, true )
    } )

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
   * @param {{}} allocation
   * @param {*} edited
   */
  vm.exit = function exit(allocation, edited) {
    editAllocationModal( edited ).result.then( function (result) {
      if ( !result ) return

      if ( !edited ) vm.allocation.distribution_to_consolidated_bids = originalBids

      vm.onEdited( { allocation: allocation, edited: edited } )

    } )
  }
}

require( './edit-allocation-modal/edit-allocation-modal.js' )
