"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp'
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

uploadTreasuryAllocationDirectiveController.$inject = [ 'baby', '$q', 'underscore' ]

function uploadTreasuryAllocationDirectiveController(baby, $q, underscore) {
  var vm = this

  vm.parsedPastedBids = []
  vm.showPasteForm = true
  var originalKeys = [
    "SEQUENCE", "TRANSACTION_DEAL_SLIP", "SWIFT", "SOURCE_OF_FUND", "DEAL_DATE", "SETTLEMENT_DATE", "PRODUCT_TYPE",
    "TRANSACTION_TYPE", "CUST_GL_ID_NO", "CUSTOMER_NAME", "CLIENT_CATEGORY", "CURRENCY", "FCY_AMOUNT", "RATE",
    "NGN_EQUIV" ]

  vm.parsedPastedBidKeys = originalKeys.concat( [ 'REF', 'NAME_NO_REF' ] )

  vm.onBlotterPasted = function onBlotterPasted() {
    if ( !vm.pastedBlotter ) return

    baby.parse( vm.pastedBlotter.trim(), {
      delimiter: '\t', header: true, step: function (row) {
        vm.parsedPastedBids.push( cleanPastedBids( row.data[ 0 ] ) )
      }
    } )

    vm.showParsedPastedBid = true
  }

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