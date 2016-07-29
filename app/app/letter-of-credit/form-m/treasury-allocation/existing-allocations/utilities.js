"use strict";

//var underscore = require( 'underscore' )

/**
 *
 * @param {{}} allocation
 * @param {Array} allocationList
 * @returns {Array}
 */
function insertAllocation(allocation, allocationList) {
  return allocationList.map( function (alloc) {
    /** @namespace allocation.id */
    if ( alloc.id === allocation.id ) return allocation
    return alloc
  } )

}

module.exports = {
  insertAllocation: insertAllocation
}
