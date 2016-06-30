"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'lc-bid-request'
] )

app.directive( 'uploadTreasuryAllocation', uploadTreasuryAllocationDirective )

uploadTreasuryAllocationDirective.$inject = []

function uploadTreasuryAllocationDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/upload-allocation/upload-allocation.html' ),
    scope: true,
    controller: 'uploadTreasuryAllocationDirectiveController as uploadTreasuryAllocation'
  }
}

app.controller( 'uploadTreasuryAllocationDirectiveController', uploadTreasuryAllocationDirectiveController )

uploadTreasuryAllocationDirectiveController.$inject = [ 'baby', 'LcBidRequest', 'underscore' ]

function uploadTreasuryAllocationDirectiveController(baby, LcBidRequest, underscore) {
  var vm = this

  vm.parsedPastedBids = []
  vm.showPasteForm = true
  var originalKeys = [ "TRANSACTION_DEAL_SLIP", "SWIFT", "SOURCE_OF_FUND", "DEAL_DATE", "SETTLEMENT_DATE", "PRODUCT_TYPE",
    "TRANSACTION_TYPE", "CUST_GL_ID_NO", "CUSTOMER_NAME", "CLIENT_CATEGORY", "CURRENCY", "FCY_AMOUNT", "RATE",
    "NGN_EQUIV" ]

  vm.parsedPastedBidKeys = [ "TRANSACTION_DEAL_SLIP", "SOURCE_OF_FUND", "DEAL_DATE", "SETTLEMENT_DATE", "PRODUCT_TYPE",
    "TRANSACTION_TYPE", "CLIENT_CATEGORY", "CURRENCY", "FCY_AMOUNT", "RATE", "NAME_NO_REF", 'REF' ]

  vm.onBlotterPasted = function onBlotterPasted() {
    if ( !vm.pastedBlotter ) return

    vm.showParsedPastedBid = true
    var cleanedData,
      ref,
      refs = []

    baby.parse( vm.pastedBlotter.trim(), {
      delimiter: '\t', header: true, step: function (row) {
        cleanedData = cleanPastedBids( row.data[ 0 ] )
        ref = cleanedData.REF

        if ( ref ) refs.push( ref )

        vm.parsedPastedBids.push( cleanedData )
      }
    } )

    if ( refs.length ) getBidRequests( refs )
  }

  /**
   * collect all bid requests with same mf number into an array and then return an object with mf number as key and
   * array of bids associated with that mf as value
   * @param {[]} bids
   * @return {{}}
   */
  function collateBidRequests(bids) {
    var result = {},
      mf

    bids.forEach( function (bid) {
      mf = bid.form_m_number

      if ( !underscore.has( result, mf ) ) result[ mf ] = [ bid ]
      else result[ mf ] = result[ mf ].concat( [ bid ] )
    } )

    return result
  }

  /**
   *
   * @param {[]} refs
   */
  function getBidRequests(refs) {
    LcBidRequest.get( { q: refs.join( ',' ), num_rows: 5000 } ).$promise.then( function (fetchedBids) {

      if ( fetchedBids.count ) {
        var results = collateBidRequests( fetchedBids.results ),
          ref

        underscore.each( vm.parsedPastedBids, function (val) {
          ref = val.REF
          if ( underscore.has( results, ref ) ) val.matched = results[ ref ]
        } )
      }
    } )
  }

  /**
   * takes each bid data and clean then according to the cleaning rules
   * @param {{}} data
   * @returns {{}} the input data now cleaned
   */
  function cleanPastedBids(data) {
    var refName, name

    underscore.each( originalKeys, function (key) {
      if ( underscore.has( data, key ) ) {
        switch ( key ) {
          case 'CUSTOMER_NAME':
          {
            name = data[ key ].trim().replace( /"/g, '' )
            data[ key ] = name
            refName = getFormMLcRef( name )
            data.REF = refName[ 0 ]
            data.NAME_NO_REF = refName[ 1 ]
            break
          }
        }
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
}