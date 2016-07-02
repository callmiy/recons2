"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation', [
  'rootApp',
  'lc-bid-request',
  'lc-service'
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

uploadTreasuryAllocationDirectiveController.$inject = [
  'baby',
  'LcBidRequest',
  'underscore',
  '$q',
  'LetterOfCredit'
]

function uploadTreasuryAllocationDirectiveController(baby, LcBidRequest, underscore, $q, LetterOfCredit) {
  var vm = this  // jshint -W040

  vm.parsedPastedBids = []
  vm.showPasteForm = true
  var originalKeys = [ 'TRANSACTION_DEAL_SLIP', 'SWIFT', 'SOURCE_OF_FUND', 'DEAL_DATE', 'SETTLEMENT_DATE', 'PRODUCT_TYPE',
    'TRANSACTION_TYPE', 'CUST_GL_ID_NO', 'CUSTOMER_NAME', 'CLIENT_CATEGORY', 'CURRENCY', 'FCY_AMOUNT', 'RATE',
    'NGN_EQUIV' ]

  vm.parsedPastedBidKeys = [ 'TRANSACTION_DEAL_SLIP', 'SOURCE_OF_FUND', 'DEAL_DATE', 'SETTLEMENT_DATE', 'PRODUCT_TYPE',
    'TRANSACTION_TYPE', 'CLIENT_CATEGORY', 'RATE', 'CURRENCY', 'NAME_NO_REF', 'REF', 'FCY_AMOUNT', 'ORIGINAL' ]

  vm.onBlotterPasted = function onBlotterPasted() {
    if ( !vm.pastedBlotter ) return

    vm.showParsedPastedBid = true

    var parsed = parsePastedBids( vm.pastedBlotter ),
      refs = parsed[ 1 ]

    vm.parsedPastedBids = parsed[ 0 ]

    if ( refs.length ) {
      $q.all( [ getBidRequests( refs ), getMfRefFromLcRef( refs ) ] ).then( function (resolves) {
        vm.parsedPastedBids = attachBidsToAllocation(
          vm.parsedPastedBids, collateBidRequests( resolves[ 0 ] ), resolves[ 1 ]
        )
      } )
    }
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
      result = []

    baby.parse( text.trim(), {
      delimiter: '\t', header: true, step: function (row) {
        cleanedData = cleanPastedBids( row.data[ 0 ] )
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
   * @param {{}} bids - existing bids retrieved from database
   * @param {{}} lcMfMapping
   * @returns {[]}
   */
  function attachBidsToAllocation(currentAllocations, bids, lcMfMapping) {
    var ref, currentOutstandings, bid

    underscore.each( currentAllocations, function (allocation) {
      ref = allocation.REF

      if ( ref.indexOf( 'ILC' ) === 0 ) {
        ref = lcMfMapping[ ref ]
      }

      if ( underscore.has( bids, ref ) ) {
        allocation.original_requests = true
        currentOutstandings = []
        bid = bids[ ref ]

        allocation.original_requests = bid.original_requests
        allocation.previous_allocations = bid.previous_allocations
        allocation.previous_outstandings = bid.previous_outstandings

        bid.previous_outstandings.forEach( function (prev) {
          //the current outstanding is previous outstanding less the current allocation sale. but because current
          // allocation sale is usually reported as negative, we do summation below
          //TODO: how do I handle allocations which are repurchases?
          //TODO: how do I handle charges and other allocations (sales and purchases) that should not reduce the outstanding allocation
          currentOutstandings.push( Number( prev ) + Number( allocation.FCY_AMOUNT ) )
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
          previous_outstandings: [ previousOutstandings ]
        }
      }
      else {
        current = result[ mf ]
        current.original_requests.push( amount )
        current.previous_outstandings.push( previousOutstandings )
        current.previous_allocations.push( previousAllocations )
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