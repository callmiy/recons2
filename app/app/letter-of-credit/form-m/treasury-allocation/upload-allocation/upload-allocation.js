"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'existing-allocations',
  'treasury-allocation-service',
  'spinner-modal',
  'confirmation-dialog'
] )

app.directive( 'uploadTreasuryAllocation', uploadTreasuryAllocationDirective )

uploadTreasuryAllocationDirective.$inject = []

function uploadTreasuryAllocationDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/upload-allocation/upload-allocation.html' ),
    scope: false,
    controller: 'uploadTreasuryAllocationDirectiveController as uploadTreasuryAllocation'
  }
}

app.controller( 'uploadTreasuryAllocationDirectiveController', uploadTreasuryAllocationDirectiveController )

uploadTreasuryAllocationDirectiveController.$inject = [
  'parsePastedBids',
  'saveBlotter',
  'underscore',
  '$scope',
  'formMAppStore',
  'requiredBlotterHeaders',
  'initAttributes',
  'makeInvalidBlotterHeadersMsg',
  'spinnerModal'
]

function uploadTreasuryAllocationDirectiveController(parsePastedBids, saveBlotter, underscore, $scope,
                                                     formMAppStore, requiredBlotterHeaders, initAttributes,
                                                     makeInvalidBlotterHeadersMsg, spinnerModal) {
  var vm = this  // jshint -W040
  var bidsFromServer

  init( $scope.$parent.treasuryAllocation.uploadAllocationParams )

  /**
   *
   * @param {{}} uploadAllocationParams
   */
  function init(uploadAllocationParams) {
    if ( underscore.isEmpty( uploadAllocationParams ) ) {
      underscore.each( initAttributes, function (val, attr) {
        vm[ attr ] = val
      } )

      bidsFromServer = []

    } else {
      underscore.each( initAttributes, function (val, attr) {
        vm[ attr ] = uploadAllocationParams[ attr ]
      } )

      bidsFromServer = uploadAllocationParams.bidsFromServer
    }
  }

  vm.closeBlotterPasteAlert = function closeBlotterPasteAlert() {
    vm.invalidPastedTextMsg = null
    vm.pastedBlotter = null
  }

  vm.onBlotterPasted = function onBlotterPasted() {
    // always reset bids from server, invalid blotter text message, and hide allocation table
    bidsFromServer = []
    vm.allocationList = null
    vm.rejectedDataList = null
    vm.invalidPastedTextMsg = ''

    if ( !vm.pastedBlotter ) return

    // vm.pastedBlotter = vm.pastedBlotter.replace(/\s*"\s*/g, '').trim()

    var parsed = parsePastedBids( vm.pastedBlotter, requiredBlotterHeaders )

    if ( parsed.error ) {
      vm.invalidPastedTextMsg = makeInvalidBlotterHeadersMsg( parsed.error )
      return
    }

    var dataSet = parsed.data
    var spinner = spinnerModal( 'Uploading allocations.....please wait...' )

    saveBlotter( dataSet ).then( function (savedDataList) {
      vm.allocationList = savedDataList

    }, function (rejectedDataList) {
      vm.rejectedDataList = rejectedDataList

    } ).finally( function () {
      spinner.dismiss()
      vm.showPasteForm = false
    } )
  }

  function getParams() {
    var obj = {}

    underscore.each( initAttributes, function (val, attr) {
      obj[ attr ] = vm[ attr ]
    } )
    return obj
  }

  function onParamsChanged() {
    var obj = {
      bidsFromServer: bidsFromServer
    }

    underscore.each( initAttributes, function (val, attr) {
      obj[ attr ] = vm[ attr ]
    } )

    formMAppStore.treasuryAllocation.uploadAllocationParams = obj
  }

  $scope.$watch( getParams, onParamsChanged, true )
}
