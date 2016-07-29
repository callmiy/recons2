"use strict";

/**
 * Searches a array of mapping and if list[key] == keyVal, returns the mapping for which the statement is true. If
 * the statement is not true for any member of the list, returns null
 * @param {[]} list - array of the form [{}, {}, {},...]
 * @param {String|Number|*} key - a potential property of any of the member of the array
 * @param {String|Number|*} keyVal - the value of the property of a member of the array
 * @returns {{}|null}
 */
function getByKey(list, key, keyVal) {
  for ( var i = 0; i < list.length; i++ ) {
    var obj = list[ i ]
    if ( obj[ key ] == keyVal ) return obj // jshint ignore:line
  }

  return null
}

module.exports = getByKey
