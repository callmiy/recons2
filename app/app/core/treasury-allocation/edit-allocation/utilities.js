"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )

var bidAttributes = [
  'id',
  'url',
  'sum_bid_requests',
  'sum_allocations',
  'outstanding_amount',
  'form_m_number',
  'lc_number',
]

/**
 *
 * @param {Array} bids
 * @param {{}} model
 * @returns {Array}
 */
function transformSelectedBids(bids, model) {
  bids = angular.copy( bids )
  var index

  for ( index = 0; index < bids.length; index++ ) {
    var bid = bids[ index ]

    if ( !underscore.isObject( bid.ref ) ) continue

    if ( underscore.isEqual( bid.ref, model ) ) {
      bids[ index ] = model
      break
    }

  }

  return formatBids( bids )
}

/**
 *
 * @param {Array} bids
 * @param {Array} attributes
 * @returns {Array}
 */
function transformRawBids(bids, attributes) {
  var obj

  bids = angular.copy( bids )

  bids = bids.map( function (bid) {
    obj = {}

    attributes.forEach( function (attribute) {
      obj[ attribute ] = bid[ attribute ]
    } )

    return obj
  } )

  return formatBids( bids )
}

/**
 * We can only distribute an allocation
 * @param {[]} bids
 * @param {Number} allocationAmount
 * @return Boolean
 */
function allocationCanBeDistributed(bids, allocationAmount) {
  var distributions = underscore.pluck( bids, 'portion_of_allocation' )
  var sumDistributions = underscore.reduce( distributions, function (memo, num) {
    return memo + num
  }, 0 )

  return Math.abs( allocationAmount ) > Math.abs( sumDistributions )
}

/**
 *
 * @param {[]} bids
 * @returns {[]}
 */
function formatBids(bids) {
  bids = angular.copy( bids )
  var index, mf, lc

  for ( index = 0; index < bids.length; index++ ) {
    var bid = bids[ index ]

    if ( underscore.has( bid, 'portion_of_allocation' ) ) {
      bid.portion_of_allocation = Math.abs( bid.portion_of_allocation )
    }

    bid.index = index
    mf = bid.form_m_number || ''
    lc = bid.lc_number || ''

    if ( mf || lc ) {
      bid.ref = (mf + ' ' + lc
      ).trim()
    }

    bids[ index ] = bid
  }

  return bids
}

/**
 *
 * @param {Array} bids
 * @param {Number} allocationAmount
 * @returns {Array}
 */
function addBid(bids, allocationAmount) {
  if ( !allocationCanBeDistributed( bids, allocationAmount ) ) return bids

  return formatBids( bids.concat( [ {} ] ) )
}

/**
 *
 * @param {Array} bids
 * @param {Number} index
 * @returns {Array}
 */
function removeBid(bids, index) {
  bids = angular.copy( bids )
  bids.splice( index, 1 )
  return bids
}

/**
 * We check whether each bid has the required attributes and the portion of allocation amount is of the proper form
 * for the bid - this check is necessary before bids can be saved
 * @param {Array} bids
 * @param {Number} allocationAmount
 * @returns {Array} - we return array of codes denoting the errors or empty array if no errors
 */
function getAllocationDistributionErrors(bids, allocationAmount) {
  var attributes,
    attributesDiff,
    utilization,
    sumDistributions = 0,
    validationError = 'validationError',
    errors = [],
    requiredAttributes = bidAttributes.concat( [
      'index', 'ref', 'portion_of_allocation'
    ] )

  try {
    underscore.each( bids, function (bid) {
      //console.log( 'bid = ', bid )
      utilization = bid.portion_of_allocation

      if ( !utilization ) {
        errors.push( 'utilization' )
        throw new Error( validationError )
      }

      attributes = underscore.keys( bid )
      attributesDiff = underscore.difference( requiredAttributes, attributes )

      if ( attributesDiff.length ) {
        errors = errors.concat( attributesDiff )
        throw new Error( validationError )
      }

      sumDistributions += utilization
    } )

  } catch ( e ) {

    if ( e.message === validationError ) return errors

    throw e
  }

  if ( sumDistributions > Math.abs( allocationAmount ) ) return [ 'distribution_is_greater' ]

  return errors
}

/**
 *Compare 2 arrays of bids, bids1.length > bids2.length
 * @param {Array} bids1
 * @param {Array} bids2
 * @returns {boolean}
 */
function bidsAreTheSame(bids1, bids2) {
  var bidObj1,
    bidObj2,
    result = [],
    attributes = bidAttributes.concat( [ 'portion_of_allocation' ] )

  function makeObject(obj) {
    var copy = {}

    underscore.each( attributes, function (key) {
      copy[ key ] = obj[ key ]
    } )

    return copy
  }

  for ( var i = 0; i < bids1.length; i++ ) {
    var bid1 = bids1[ i ]
    bidObj1 = makeObject( bid1 )

    for ( var j = 0; j < bids2.length; j++ ) {
      var bid2 = bids2[ j ]
      bidObj2 = makeObject( bid2 )
      result.push( underscore.isEqual( bidObj1, bidObj2 ) )
    }

  }

  return underscore.every( result, function (val) {
    return val === true
  } )
}

/**
 *
 * @param {Array} newBids
 * @param {Array} originalBids
 * @returns {boolean}
 */
function bidsCanBeSaved(newBids, originalBids) {
  var newBidsLen = newBids.length,
    originalBidsLen = originalBids.length

  //we have attached at least one extra allocation
  if ( newBidsLen > originalBidsLen ) return true
  if ( bidsAreTheSame( newBids, originalBids ) ) return false

  return true
}

/**
 * Given an array of errors from validation of user's distribution of an allocation, get the string that will be
 * displayed to user to inform about error
 * @param {Array} errors
 * @returns {string}
 */
function getErrorText(errors) {
  var text
  if ( underscore.contains( errors, 'utilization' ) ) text = 'Error in utilization!'

  else if ( underscore.contains( errors, 'distribution_is_greater' ) ) text = 'Utilization more than allocated amount!'

  return text
}

module.exports = {
  allocationCanBeDistributed: allocationCanBeDistributed,
  formatBids: formatBids,
  addBid: addBid,
  removeBid: removeBid,
  bidsCanBeSaved: bidsCanBeSaved,
  transformRawBids: transformRawBids,
  bidAttributes: bidAttributes,
  transformSelectedBids: transformSelectedBids,
  getAllocationDistributionErrors: getAllocationDistributionErrors,
  getErrorText: getErrorText
}
