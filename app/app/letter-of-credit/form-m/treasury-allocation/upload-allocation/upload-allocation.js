"use strict";

/*jshint camelcase:false*/


var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'lc-bid-request',
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
  'baby',
  'LcBidRequest',
  'underscore',
  '$q',
  'LetterOfCredit',
  'NgTableParams',
  'TreasuryAllocation',
  'toISODate',
  'moment',
  'spinnerService',
  'confirmationDialog',
  '$scope',
  'formMAppStore'
]

function uploadTreasuryAllocationDirectiveController(baby, LcBidRequest, underscore, $q, LetterOfCredit, NgTableParams,
                                                     TreasuryAllocation, toISODate, moment, spinnerService,
                                                     confirmationDialog, $scope, formMAppStore) {
  var vm = this  // jshint -W040

  var uploadAllocationParams = $scope.$parent.treasuryAllocation.uploadAllocationParams,
    bidsFromServer

  if ( underscore.isEmpty( uploadAllocationParams ) ) {
    vm.showPasteForm = true
    vm.isSaving = false
    vm.showParsedPastedBid = false
    vm.tableParams = null
    vm.pastedBlotter = ''
    bidsFromServer = []

  } else {
    vm.showPasteForm = uploadAllocationParams.showPasteForm
    vm.isSaving = uploadAllocationParams.isSaving
    vm.showParsedPastedBid = uploadAllocationParams.showParsedPastedBid
    vm.tableParams = uploadAllocationParams.tableParams
    vm.pastedBlotter = uploadAllocationParams.pastedBlotter
    bidsFromServer = uploadAllocationParams.bidsFromServer
  }

  vm.onBlotterPasted = function onBlotterPasted() {
    // always reset bids from server
    bidsFromServer = []

    if ( !vm.pastedBlotter ) return

    vm.showParsedPastedBid = true

    var parsed = parsePastedBids( vm.pastedBlotter ),
      dataset = parsed[ 0 ],
      refs = parsed[ 1 ]

    vm.tableParams = new NgTableParams( { sorting: { REF: 'desc' }, count: 1000000 }, { dataset: dataset, counts: [] } )

    if ( refs.length ) {
      $q.all( [ getBidRequests( refs ), getMfRefFromLcRef( refs ) ] ).then( function (resolves) {

        bidsFromServer = resolves[ 0 ]
        var mfLcRefMapping = resolves[ 1 ]
        vm.tableParams.dataset = attachBidsToAllocation( dataset, collateBidRequests( bidsFromServer ), mfLcRefMapping )
      } )
    }
  }

  vm.removeOriginalRequest = function removeOriginalRequest(allocationIndex, requestIndex) {
    for ( var i = 0; i < vm.tableParams.data.length; i++ ) {
      var obj = vm.tableParams.data[ i ]

      if ( obj.index == allocationIndex ) { // jshint ignore:line
        //TODO: make it possible to restore request after it has been deleted
        obj.original_requests.splice( requestIndex, 1 )
        obj.previous_allocations.splice( requestIndex, 1 )
        obj.previous_outstandings.splice( requestIndex, 1 )
        obj.current_outstandings.splice( requestIndex, 1 )
        obj.bid_ids.splice( requestIndex, 1 )
        break
      }
    }
  }

  vm.showSaveBtn = function showSaveBtn(data) {
    if ( !data ) return false

    var obj

    for ( var key in data ) {
      if ( data.hasOwnProperty( key ) ) {
        obj = data[ key ]

        if ( underscore.has( obj, 'bid_ids' ) && obj.bid_ids.length > 1 ) return false
      }
    }

    return true
  }

  vm.saveAllocations = function saveAllocations(data) {
    var toBeSaved = [],
      bidIds,
      associatedBid

    vm.isSaving = true
    spinnerService.show( 'treasuryAllocationSpinner' )

    underscore.each( data, function (obj) {
      bidIds = obj.bid_ids
      associatedBid = bidIds ? getByKey( bidsFromServer, 'id', bidIds[ 0 ] ).url : null

      toBeSaved.push( {
        deal_number: obj.TRANSACTION_DEAL_SLIP,
        transaction_type: obj.TRANSACTION_TYPE,
        product_type: obj.PRODUCT_TYPE,
        customer_name: obj.CUSTOMER_NAME,
        customer_name_no_ref: obj.NAME_NO_REF,
        ref: obj.REF,
        client_category: obj.CLIENT_CATEGORY,
        source_of_fund: obj.SOURCE_OF_FUND,
        currency: obj.CURRENCY,
        fcy_amount: obj.FCY_AMOUNT,
        naira_rate: obj.RATE,
        deal_date: toISODate( obj.DEAL_DATE ),
        settlement_date: toISODate( obj.SETTLEMENT_DATE ),
        original_request: associatedBid,
      } )
    } )

    TreasuryAllocation.saveMany( toBeSaved ).$promise.then( function (savedData) {
      confirmationDialog.showDialog( {
        title: 'Allocations successfully saved',
        text: savedData.length + ' allocations uploaded',
        infoOnly: true
      } ).then( function () {
        $scope.$parent.treasuryAllocation.action = null
      } )

    }, function (xhr) {
      confirmationDialog.showDialog( {
        title: 'Error',
        text: 'An error occurred while saving allocations.\nThis error has been logged.\nPlease inform admin.',
        infoOnly: true
      } )

      console.log( 'xhr = ', xhr ) //TODO: remove console logging

    } ).finally( function () {
      vm.isSaving = false
      spinnerService.hide( 'treasuryAllocationSpinner' )
    } )
  }

  function getByKey(list, key, keyVal) {
    for ( var i = 0; i < list.length; i++ ) {
      var obj = list[ i ]
      if ( obj[ key ] == keyVal ) return obj // jshint ignore:line
    }

    return null
  }

  /**
   *
   * @param {String} text
   * @returns {*[]}
   */
  function parsePastedBids(text) {
    var cleanedData,
      ref,
      refs = [],
      result = [],
      index = 1

    baby.parse( text.trim(), {
      delimiter: '\t', header: true, step: function (row) {
        cleanedData = cleanPastedBids( row.data[ 0 ] )
        cleanedData.index = index++
        ref = cleanedData.REF

        if ( ref ) refs.push( ref )

        result.push( cleanedData )
      }
    } )

    return [ result, refs ]
  }

  function getMfRefFromLcRef(refs) {
    var deferred = $q.defer()

    var lcReferences = refs.filter( function (ref) {
      return ref.indexOf( 'MF20' ) === -1
    } )

    if ( !lcReferences.length ) return deferred.resolve( {} )

    LetterOfCredit.get( {
      lc_numbers: lcReferences.join( ',' ),
      fields: 'mf,lc_number'

    } ).$promise.then( function (lcList) {
      var result = {}

      if ( lcList.count ) {
        lcList.results.forEach( function (lc) {
          result[ lc.lc_number ] = lc.mf
        } )
      }
      deferred.resolve( result )

    }, function (xhr) {
      deferred.reject( xhr )
    } )

    return deferred.promise
  }

  /**
   *
   * @param {[]} currentAllocations
   * @param {{}} collatedBids - existing bids retrieved from database
   * @param {{}} lcMfMapping
   * @returns {[]}
   */
  function attachBidsToAllocation(currentAllocations, collatedBids, lcMfMapping) {
    var ref, currentOutstandings, collatedBid, allocatedAmount

    underscore.each( currentAllocations, function (allocation) {
      ref = allocation.REF

      if ( ref.indexOf( 'ILC' ) === 0 ) {
        ref = lcMfMapping[ ref ]
      }

      if ( underscore.has( collatedBids, ref ) ) {
        allocation.original_requests = true
        currentOutstandings = []
        collatedBid = collatedBids[ ref ]
        allocatedAmount = allocation.FCY_AMOUNT
        // we will always make sales allocation a negative number
        allocatedAmount = allocation.TRANSACTION_TYPE.toLowerCase() === 'sale' ? (-1 * allocatedAmount) : allocatedAmount

        allocation.original_requests = collatedBid.original_requests
        allocation.previous_allocations = collatedBid.previous_allocations
        allocation.previous_outstandings = collatedBid.previous_outstandings
        allocation.bid_ids = collatedBid.bid_ids

        collatedBid.previous_outstandings.forEach( function (prev) {
          //the current outstanding is previous outstanding less the current allocation sale. But we do sum below since
          // sales is a negative number
          // TODO: how do I handle allocations which are repurchases?
          // TODO: how do I handle charges and other allocations (sales and purchases) that should not reduce the
          // outstanding allocation
          currentOutstandings.push( Number( prev ) + allocatedAmount )
        } )

        allocation.current_outstandings = currentOutstandings
      }
    } )

    return currentAllocations
  }

  /**
   * collect all bid requests with same mf number into an array and then return an object with mf number as key and
   * array of bids associated with that mf as value
   * @param {[]} bids
   * @return {{}}
   */
  function collateBidRequests(bids) {
    var result = {},
      mf,
      amount,
      previousAllocations,
      previousOutstandings,
      current

    bids.forEach( function (bid) {
      mf = bid.form_m_number
      amount = Number( bid.amount )
      previousAllocations = bid.sum_allocations
      previousOutstandings = bid.unallocated

      if ( !underscore.has( result, mf ) ) {
        result[ mf ] = {
          original_requests: [ amount ],
          previous_allocations: [ previousAllocations ],
          previous_outstandings: [ previousOutstandings ],
          bid_ids: [ bid.id ]
        }
      }
      else {
        current = result[ mf ]
        current.original_requests.push( amount )
        current.previous_outstandings.push( previousOutstandings )
        current.previous_allocations.push( previousAllocations )
        current.bid_ids.push( bid.id )
        result[ mf ] = current
      }
    } )

    return result
  }

  /**
   *
   * @param {[]} refs
   */
  function getBidRequests(refs) {
    var deferred = $q.defer()

    LcBidRequest.get( { q: refs.join( ',' ), num_rows: 5000 } ).$promise.then( function (fetchedBids) {
      deferred.resolve( fetchedBids.count && fetchedBids.results || null )

    }, function (xhr) {
      deferred.reject( xhr )
    } )

    return deferred.promise
  }

  /**
   * takes each bid data and clean then according to the cleaning rules
   * @param {{}} data
   * @returns {{}} the input data now cleaned
   */
  function cleanPastedBids(data) {
    var refName

    underscore.each( data, function (val, key) {
      data[ key ] = val.trim()

      if ( key === 'CUSTOMER_NAME' ) {
        val = val.replace( /"/g, '' )
        data.CUSTOMER_NAME = val
        refName = getFormMLcRef( val )
        data.REF = refName[ 0 ]
        data.NAME_NO_REF = refName[ 1 ]
      }

      if ( key === 'FCY_AMOUNT' ) {
        data.FCY_AMOUNT = Math.abs( Number( val ) )
      }

      if ( key.indexOf( '_DATE' ) > 1 ) {
        data[ key ] = moment( val, 'DD-MM-YYYY' )._d
      }
    } )

    return data
  }

  function getFormMLcRef(val) {
    var FORM_M_LC_REGEXP = new RegExp( "((MF20\\d+)|(ILC[A-Z]+\\d+))", 'ig' ),
      exec = FORM_M_LC_REGEXP.exec( val ),
      ref = exec ? exec[ 1 ] : ''

    return [ ref, val.replace( ref, '' ).trim() ]
  }

  function getParams() {
    return {
      showPasteForm: vm.showPasteForm,
      isSaving: vm.isSaving,
      showParsedPastedBid: vm.showParsedPastedBid,
      tableParams: vm.tableParams,
      pastedBlotter: vm.pastedBlotter
    }
  }

  function onParamsChanged() {
    formMAppStore.treasuryAllocation.uploadAllocationParams = {
      showPasteForm: vm.showPasteForm,
      isSaving: vm.isSaving,
      showParsedPastedBid: vm.showParsedPastedBid,
      tableParams: vm.tableParams,
      pastedBlotter: vm.pastedBlotter,
      bidsFromServer: bidsFromServer
    }
  }

  $scope.$watch( getParams, onParamsChanged, true )
}
