"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service',
  'ngTable',
  'angularSpinners',
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
  'NgTableParams',
  '$scope',
  'formMAppStore',
  'requiredBlotterHeaders',
  'initAttributes',
  'makeInvalidBlotterHeadersMsg'
]

function uploadTreasuryAllocationDirectiveController(parsePastedBids, saveBlotter, underscore, NgTableParams, $scope,
                                                     formMAppStore, requiredBlotterHeaders, initAttributes,
                                                     makeInvalidBlotterHeadersMsg) {
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
    vm.showParsedPastedBid = false
    vm.rejectedDataList = null
    vm.invalidPastedTextMsg = ''

    if ( !vm.pastedBlotter ) return

    var parsed = parsePastedBids( vm.pastedBlotter, requiredBlotterHeaders )

    if ( parsed.error ) {
      vm.invalidPastedTextMsg = makeInvalidBlotterHeadersMsg( parsed.error )
      return
    }

    var dataSet = parsed.data,
      refs = parsed.refs

    saveBlotter( dataSet ).then( function (savedDataList) {
      console.log( 'savedDataList = ', savedDataList )
      vm.tableParams = new NgTableParams(
        { sorting: { REF: 'desc' }, count: 1000000 },
        { dataset: savedDataList, counts: [] }
      )

      vm.showParsedPastedBid = true

    }, function (rejectedDataList) {
      vm.rejectedDataList = rejectedDataList
    } )

    //if ( refs.length ) {
    //  $q.all( [ getBidRequests( refs ), getMfRefFromLcRef( refs ) ] ).then( function (bidsMfRefMapping) {
    //
    //    bidsFromServer = bidsMfRefMapping[ 0 ]
    //    var mfLcRefMapping = bidsMfRefMapping[ 1 ]
    //
    //    vm.tableParams.dataset = attachBidsToAllocation( dataset, collateBidRequests( bidsFromServer ),
    // mfLcRefMapping ) } ) }
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
