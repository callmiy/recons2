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
 * @param {Number} amount
 * @return Boolean
 */
function allocationCanBeDistributed(bids, amount) {
  var distributions = underscore.pluck( bids, 'portion_of_allocation' )
  var sumDistributions = underscore.reduce( distributions, function (memo, num) {
    return memo + num
  }, 0 )

  return Math.abs( amount ) > Math.abs( sumDistributions )
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
 *
 * @param {Array} newBids
 * @param {Array} originalBids
 * @returns {boolean}
 */
function bidsChanged(newBids, originalBids) {
  //if ( newBids.length !== originalBids.length ) return true

  console.log( 'newBids = ', newBids )
  console.log( 'originalBids = ', originalBids )

  var newBidsFormsM = underscore.pluck( newBids, 'form_m_number' )
  var originalBidsFormsM = underscore.pluck( originalBids, 'form_m_number' )
  var formMChanged = underscore.difference( originalBidsFormsM, newBidsFormsM )
  console.log( 'newBidsFormsM = ', newBidsFormsM )
  console.log( 'originalBidsFormsM = ', originalBidsFormsM )
  console.log( 'formMChanged = ', formMChanged )

  return true
}

module.exports = {
  allocationCanBeDistributed: allocationCanBeDistributed,
  formatBids: formatBids,
  addBid: addBid,
  removeBid: removeBid,
  bidsChanged: bidsChanged,
  transformRawBids: transformRawBids,
  bidAttributes: bidAttributes,
  transformSelectedBids: transformSelectedBids
}
