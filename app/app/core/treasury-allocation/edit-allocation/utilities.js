"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )

/**
 *
 * @param {[]} bids
 * @param {Number} amount
 * @return Boolean
 */
function allocationCanBeDistributed(bids, amount) {
  var distributions = underscore.pluck( bids, 'portion_of_allocation' )
  var sumDistributions = underscore.reduce( distributions, function (memo, num) {
    return memo + num
  }, 0 )

  return amount > sumDistributions
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

    if ( mf || lc ) { bid.ref = mf + ' ' + lc}

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
  bidsChanged: bidsChanged
}
