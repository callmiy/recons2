"use strict";

/*jshint camelcase:false*/

var stateStore = require( './store-state.js' )
var utilities = require( './utilities.js' )

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'display-allocations',
  'treasury-allocation-service',
  'spinner-modal',
  'confirmation-dialog'
] )

app.directive( 'uploadTreasuryAllocation', uploadTreasuryAllocationDirective )
uploadTreasuryAllocationDirective.$inject = [ 'formMAppStore' ]

function uploadTreasuryAllocationDirective(formMAppStore) {
  function link(scope, $elm, attrs, ctrl) {
    scope.$on( '$destroy', function () {
      stateStore.storeSate( ctrl, formMAppStore )
    } )
  }

  return {
    restrict: 'A',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/upload-allocation/upload-allocation.html' ),
    scope: false,
    controller: 'uploadTreasuryAllocationDirectiveController as uploadTreasuryAllocation',
    link: link
  }
}

app.controller( 'uploadTreasuryAllocationDirectiveController', uploadTreasuryAllocationDirectiveController )

uploadTreasuryAllocationDirectiveController.$inject = [
  'saveBlotter',
  'formMAppStore',
  'spinnerModal'
]

function uploadTreasuryAllocationDirectiveController(saveBlotter, formMAppStore, spinnerModal) {
  var vm = this  // jshint -W040

  stateStore.setState( formMAppStore, vm )

  vm.closeBlotterPasteAlert = function closeBlotterPasteAlert() {
    vm.invalidPastedTextMsg = null
    vm.pastedBlotter = null
  }

  vm.onBlotterPasted = function onBlotterPasted() {
    // always reset bids from server, invalid blotter text message, and hide allocation table
    vm.bidsFromServer = []
    vm.allocationList = null
    vm.rejectedDataList = null
    vm.invalidPastedTextMsg = ''

    if ( !vm.pastedBlotter ) return

    var parsed = utilities.parsePastedBids( vm.pastedBlotter )

    if ( parsed.error ) {
      vm.invalidPastedTextMsg = utilities.makeInvalidBlotterHeadersMsg( parsed.error )
      return
    }

    var dataSet = parsed.data
    var spinner = spinnerModal( 'Uploading allocations..' )

    saveBlotter( dataSet ).then( function (savedDataList) {
      vm.allocationList = savedDataList

    }, function (rejectedDataList) {
      vm.rejectedDataList = rejectedDataList

    } ).finally( function () {
      spinner.dismiss()
      vm.showPasteForm = false
    } )
  }
}
