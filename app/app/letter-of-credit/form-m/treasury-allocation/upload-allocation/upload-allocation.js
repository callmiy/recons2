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

  var requiredBlotterHeaders = {
      TRANSACTION_DEAL_SLIP: 'deal_number',
      DEAL_DATE: 'deal_date',
      SETTLEMENT_DATE: 'settlement_date',
      TRANSACTION_TYPE: 'transaction_type',
      RATE: 'naira_rate',
      CURRENCY: 'currency',
      FCY_AMOUNT: 'fcy_amount',
      PRODUCT_TYPE: 'product_type',
      CUSTOMER_NAME: 'customer_name',
      CLIENT_CATEGORY: 'client_category',
      SOURCE_OF_FUND: 'source_of_fund'
    },
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

    var parsed = parsePastedBids( vm.pastedBlotter, requiredBlotterHeaders )

    if ( parsed.error ) {
      vm.invalidPastedTextMsg = 'Pasted text missing headers:\n' + parsed.error.map( function (header) {
          return '  - ' + header
        } ).join( '\n' )
      return
    }

    var dataSet = parsed.data,
      refs = parsed.refs

    savePastedBlotter( dataSet )

    vm.tableParams = new NgTableParams( { sorting: { REF: 'desc' }, count: 1000000 }, { dataset: dataSet, counts: [] } )
    vm.showParsedPastedBid = true

    //if ( refs.length ) {
    //  $q.all( [ getBidRequests( refs ), getMfRefFromLcRef( refs ) ] ).then( function (bidsMfRefMapping) {
    //
    //    bidsFromServer = bidsMfRefMapping[ 0 ]
    //    var mfLcRefMapping = bidsMfRefMapping[ 1 ]
    //
    //    vm.tableParams.dataset = attachBidsToAllocation( dataset, collateBidRequests( bidsFromServer ),
    // mfLcRefMapping ) } ) }
  }

  /**
   *
   * @param {[]} dataList
   */
  function savePastedBlotter(dataList) {
    var dataClone, dataToSave

    dataToSave = dataList.map( function (data) {
      dataClone = angular.copy( data )
      dataClone.deal_date = toISODate( dataClone.deal_date )
      dataClone.settlement_date = toISODate( dataClone.settlement_date )

      return dataClone

    } )

    TreasuryAllocation.saveMany( dataToSave ).$promise.then( function (savedData) {
      console.log( savedData )

    }, function (xhr) {

      if ( xhr.status === 400 ) {
        console.log( handleSave400Error( xhr.data, dataToSave ) )
        throw  new Error( 'display table of rejected data with reason' )
      }

    } )
  }

  /**
   * For a 400 xhr error, extract all the errors and put in a an array, then return array of errors. If no error,
   * return null.
   *
   * @param {{}} errorObj
   * @param {{}} rejectedData
   * @returns {null|Array}
   */
  function extract400Errors(errorObj, rejectedData) {
    if ( underscore.isEmpty( errorObj ) ) return null

    var errorList = []

    if ( underscore.has( errorObj, 'non_field_errors' ) ) {
      errorObj.non_field_errors.forEach( function (error) {
        errorList.push( error )
      } )

      delete errorObj.non_field_errors
    }

    underscore.each( errorObj, function (val, key) {
      if ( underscore.has( rejectedData, key ) ) {

        val.forEach( function (theVal) {
          errorList.push( key + ' - ' + theVal )
        } )
      }
    } )

    return errorList
  }

  /**
   *
   * @param {[]} errorList
   * @param {[]} rejectedDataList
   * @return {[]}
   */
  function handleSave400Error(errorList, rejectedDataList) {
    var i, errorObj, rejectedData, errors

    for ( i = 0; i < errorList.length; i++ ) {
      errorObj = errorList[ i ]
      rejectedData = rejectedDataList[ i ]
      errors = extract400Errors( errorObj, rejectedData )

      if ( errors ) rejectedData.errors = errors
    }

    return rejectedDataList
  }

  /**
   *
   * @param {String} text
   * @param {{}} requiredHeadersMap
   * @returns {{}}
   */
  function parsePastedBids(text, requiredHeadersMap) {
    var cleanedData,
      ref,
      refs = [],
      result = [],
      index = 1,
      rowData,
      requiredHeadersInRowData,
      requiredHeadersKeys = underscore.keys( requiredHeadersMap ),
      missingRequiredHeaders = []

    try {
      baby.parse( text.trim(), {
        delimiter: '\t', header: true, step: function (row) {
          rowData = row.data[ 0 ]
          requiredHeadersInRowData = underscore.intersection( underscore.keys( rowData ), requiredHeadersKeys )
          missingRequiredHeaders = underscore.difference( requiredHeadersKeys, requiredHeadersInRowData )

          if ( missingRequiredHeaders.length ) throw new Error( 'INVALID-PASTED-HEADERS' )

          cleanedData = cleanPastedBids( rowData, requiredHeadersMap )
          cleanedData.index = index++
          ref = cleanedData.ref

          if ( ref ) refs.push( ref )

          result.push( cleanedData )
        }
      } )
    } catch ( e ) {
      if ( e.message === 'INVALID-PASTED-HEADERS' ) {
        return { error: missingRequiredHeaders }
      }
    }

    //baby-parse could not parse the text and did not throw error
    if ( !result.length ) return { error: requiredHeadersKeys }

    return { data: result, refs: refs }
  }

  /**
   * takes each bid data and clean then according to the cleaning rules. Then transform the keys into suitable ones
   * @param {{}} data
   * @param {{}} headersMap
   * @returns {{}} the input data now cleaned
   */
  function cleanPastedBids(data, headersMap) {
    var refName

    underscore.each( data, function (val, key) {
      data[ key ] = val.trim()

      if ( key === 'CUSTOMER_NAME' ) {
        val = val.replace( /"/g, '' )
        data.CUSTOMER_NAME = val
        refName = getFormMLcRef( val )
        data.ref = refName[ 0 ]
        data.customer_name_no_ref = refName[ 1 ]
      }

      if ( key === 'FCY_AMOUNT' ) {
        data.FCY_AMOUNT = Math.abs( Number( val.replace( /[\(\)\s]/g, '' ) ) )
      }

      if ( key.indexOf( '_DATE' ) > 1 ) {
        data[ key ] = moment( val, 'DD-MM-YYYY' )._d
      }
    } )

    underscore.each( headersMap, function (val, key) {
      data[ val ] = data[ key ]
      delete data[ key ]
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
