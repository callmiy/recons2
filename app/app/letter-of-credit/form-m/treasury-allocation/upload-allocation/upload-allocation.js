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
  'baby',
  'ConsolidatedLcBidRequest',
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
  'formMAppStore',
  'getByKey',
  'collateBidRequests'
]

function uploadTreasuryAllocationDirectiveController(baby, ConsolidatedLcBidRequest, underscore, $q, LetterOfCredit,
                                                     NgTableParams, TreasuryAllocation, toISODate, moment,
                                                     spinnerService, confirmationDialog, $scope, formMAppStore,
                                                     getByKey, collateBidRequests) {
  var vm = this  // jshint -W040

  var requiredBlotterHeaders = [
      'TRANSACTION_DEAL_SLIP',
      'DEAL_DATE',
      'SETTLEMENT_DATE',
      'TRANSACTION_TYPE',
      'RATE',
      'CURRENCY',
      'FCY_AMOUNT'
    ],
    initAttributes = {
      showPasteForm: true,
      isSaving: false,
      showParsedPastedBid: false,
      tableParams: null,
      pastedBlotter: '',
      invalidPastedTextMsg: ''
    },
    bidsFromServer

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
    vm.invalidPastedTextMsg = ''

    if ( !vm.pastedBlotter ) return

    var invalidHeaders = getInvalidPastedTextHeader( vm.pastedBlotter, requiredBlotterHeaders )

    if ( invalidHeaders.length ) {
      vm.invalidPastedTextMsg = 'Pasted text missing headers:\n' + invalidHeaders.map( function (header) {
          return '  - ' + header
        } ).join( '\n' )
      return
    }

    vm.showParsedPastedBid = true

    var parsed = parsePastedBids( vm.pastedBlotter ),
      dataset = parsed[ 0 ],
      refs = parsed[ 1 ]

    vm.tableParams = new NgTableParams( { sorting: { REF: 'desc' }, count: 1000000 }, { dataset: dataset, counts: [] } )

    if ( refs.length ) {
      $q.all( [ getBidRequests( refs ), getMfRefFromLcRef( refs ) ] ).then( function (bidsMfRefMapping) {

        bidsFromServer = bidsMfRefMapping[ 0 ]
        var mfLcRefMapping = bidsMfRefMapping[ 1 ]

        vm.tableParams.dataset = attachBidsToAllocation( dataset, collateBidRequests( bidsFromServer ), mfLcRefMapping )
      } )
    }
  }

  /**
   * Allocations are mapped to existing bid requests (original requests). The user will determine if this mapping is
   * valid. This is especially true for situations where more than one original requests is mapped to one allocation.
   * In this regard, user will determine which singular request should be validly mapped to the allocation. This
   * function will mark an original request marked to an allocation as invalid (unmap) for this allocation. User can
   * also reinstate an already unmapped allocation
   * @param {int|String} allocationIndex - the index of allocation in the collection of allocations
   *   (vm.tableParams.data)
   * @param {int|String} requestIndex - the index of the original request to be mapped or unmapped
   */
  vm.toggleMapOriginalRequest = function toggleMapOriginalRequest(allocationIndex, requestIndex) {
    var obj, current
    for ( var i = 0; i < vm.tableParams.data.length; i++ ) {
      obj = vm.tableParams.data[ i ]

      if ( obj.index == allocationIndex ) { // jshint ignore:line
        current = obj.original_requests_deleted[ requestIndex ]

        if ( current === null ) obj.original_requests_deleted[ requestIndex ] = requestIndex
        else obj.original_requests_deleted[ requestIndex ] = null

        return
      }
    }
  }

  /**
   * We only show the save button when there is no allocation that has more than one original request mapped to it.
   * @param {[]} data - array of allocations (vm.tableParams.data)
   * @returns {boolean}
   */
  vm.showSaveBtn = function showSaveBtn(data) {
    function countNulls(list) {
      return list.filter( function (val) {
        return val === null
      } ).length
    }

    if ( !data ) return false

    var obj

    for ( var key in data ) {
      if ( data.hasOwnProperty( key ) ) {
        obj = data[ key ]

        if ( underscore.has( obj, 'original_requests_deleted' ) ) {

          if ( countNulls( obj.original_requests_deleted ) > 1 ) return false
        }
      }
    }

    return true
  }

  vm.saveAllocations = function saveAllocations(data) {

    /**
     *
     * @param {null|[]} mappingList
     * @param {null|[]} bidIds
     * @returns {[]}
     */
    function getMappedBids(mappingList, bidIds) {

      if ( !(mappingList && bidIds
        ) ) {
        return []
      }

      var bids = [],
        bid

      for ( var i = 0; i < mappingList.length; i++ ) {
        if ( mappingList[ i ] === null ) {
          bid = getByKey( bidsFromServer, 'id', bidIds[ i ] )
          if ( bid ) bids.push( bid )
        }
      }

      return bids
    }

    var toBeSavedList = [],
      associatedBids,
      mappedBids,
      fcyAmount,
      amountMapped,
      toBeSaved

    vm.isSaving = true
    spinnerService.show( 'treasuryAllocationSpinner' )

    underscore.each( data, function (obj) {
      mappedBids = getMappedBids( obj.original_requests_deleted, obj.bid_ids )

      associatedBids = mappedBids.map( function (bid) {
        return bid.url
      } )

      fcyAmount = obj.FCY_AMOUNT
      amountMapped = null

      toBeSaved = {
        deal_number: obj.TRANSACTION_DEAL_SLIP,
        transaction_type: obj.TRANSACTION_TYPE,
        product_type: obj.PRODUCT_TYPE,
        customer_name: obj.CUSTOMER_NAME,
        customer_name_no_ref: obj.NAME_NO_REF,
        ref: obj.REF,
        client_category: obj.CLIENT_CATEGORY,
        source_of_fund: obj.SOURCE_OF_FUND,
        currency: obj.CURRENCY,
        fcy_amount: fcyAmount,
        naira_rate: obj.RATE,
        deal_date: toISODate( obj.DEAL_DATE ),
        settlement_date: toISODate( obj.SETTLEMENT_DATE ),
        consolidated_bids: associatedBids
      }

      //:TODO where one treasury allocation is mapped to multiple consolidated bid
      //:TODO Where one consolidated bid has several treasury allocations mapped to it
      if ( mappedBids.length ) {
        var bid = mappedBids[ 0 ]
        amountMapped = {}
        amountMapped[ bid.id ] = fcyAmount
        toBeSaved.distribution_to_consolidated_bids = amountMapped
      }

      toBeSavedList.push( toBeSaved )
    } )

    TreasuryAllocation.saveMany( toBeSavedList ).$promise.then( function (savedData) {
      confirmationDialog.showDialog( {
        title: 'Allocations successfully saved',
        text: savedData.length + ' allocations uploaded',
        infoOnly: true

      } ).then( function () {
        init( {} )
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
        currentOutstandings = []
        collatedBid = collatedBids[ ref ]
        allocatedAmount = allocation.FCY_AMOUNT
        // we will always make sales allocation a negative number
        if ( allocation.TRANSACTION_TYPE.toLowerCase() === 'sale' ) allocatedAmount = -1 * allocatedAmount

        allocation.original_requests = collatedBid.original_requests
        allocation.previous_allocations = collatedBid.previous_allocations
        allocation.previous_outstandings = collatedBid.previous_outstandings
        allocation.bid_ids = collatedBid.bid_ids
        allocation.original_requests_deleted = collatedBid.original_requests_deleted

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
   *
   * @param {[]} refs
   */
  function getBidRequests(refs) {
    var deferred = $q.defer()

    ConsolidatedLcBidRequest.get( { q: refs.join( ',' ), num_rows: 5000 } ).$promise.then( function (fetchedBids) {
      deferred.resolve( fetchedBids.count && fetchedBids.results || [] )

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

  /**
   *
   * @param {String} text
   * @param {[]} requiredHeaders
   * @returns {[]}
   */
  function getInvalidPastedTextHeader(text, requiredHeaders) {
    var invalidHeaders = []

    for ( var i = 0; i < requiredHeaders.length; i++ ) {
      var header = requiredHeaders[ i ];
      if ( text.indexOf( header ) === -1 ) invalidHeaders.push( header )
    }

    return invalidHeaders
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
