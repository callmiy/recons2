"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation' )

app.factory( 'parsePastedBids', parsePastedBids )
parsePastedBids.$inject = [
  'underscore',
  'moment',
  'baby'
]

function parsePastedBids(underscore, moment, baby) {

  /**
   *
   * @param {String} text
   * @param {{}} requiredHeadersMap
   * @returns {{}}
   */
  function parse(text, requiredHeadersMap) {
    var cleanedData,
      result = [],
      index = 1,
      rowData,
      requiredHeadersInRowData,
      requiredHeadersKeys = underscore.keys( requiredHeadersMap ),
      missingRequiredHeaders = []

    try {
      baby.parse( text.trim(), {
        delimiter: '\t', header: true, step: function (row) {
          rowData = cleanHeaders( row.data[ 0 ] )
          requiredHeadersInRowData = underscore.intersection( underscore.keys( rowData ), requiredHeadersKeys )
          missingRequiredHeaders = underscore.difference( requiredHeadersKeys, requiredHeadersInRowData )

          if ( missingRequiredHeaders.length ) throw new Error( 'INVALID-PASTED-HEADERS' )

          cleanedData = cleanPastedBids( rowData, requiredHeadersMap )
          cleanedData.index = index++
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

    console.log( 'result length = ', result.length )

    return { data: result }
  }

  /**
   * Sometimes the blotter headers (which will be the keys of the row data) contain undesirable chars such as [\s "]. We
   * format the headers to remove these
   * @param {{}} rowData
   * @returns {{}}
   */
  function cleanHeaders(rowData) {
    var obj = {},
      toBeRemovedRe = /[\s"]/g

    underscore.each( rowData, function (val, key) {
      obj[ key.replace( toBeRemovedRe, '' ) ] = val
    } )

    return obj
  }

  /**
   * takes each bid data and clean then according to the cleaning rules. Then transform the keys into suitable ones
   * @param {{}} data
   * @param {{}} headersMap
   * @returns {{}} the input data now cleaned
   */
  function cleanPastedBids(data, headersMap) {

    /**
     * Convert to number and optionally decimal places
     * @param {number|String} val - the value to be converted to floating point number
     * @param {null|number} precision - the precision
     * @returns {number}
     */
    function toNumber(val, precision) {
      val = Number( val.replace( /[,\(\)\s]/g, '' ) )

      if ( precision !== null && typeof precision !== 'undefined' ) {
        val = Number( val.toFixed( precision ) )
      }

      return val
    }

    var refName, fcyAmount

    underscore.each( data, function (val, key) {
      val = val.replace( /"?\s*?(.+)?\s*"?/ig, function (matched, text) {
        return text.trim()
      } )

      data[ key ] = val

      if ( key === 'RATE' ) {
        data.RATE = toNumber( val, 4 )
      }

      if ( key === 'CUSTOMER_NAME' ) {
        data.CUSTOMER_NAME = val
        refName = getFormMLcRef( val )
        data.ref = refName[ 0 ]
        data.customer_name_no_ref = refName[ 1 ]
      }

      if ( key === 'FCY_AMOUNT' ) {
        fcyAmount = Math.abs( toNumber( val ) )

        if ( !fcyAmount || isNaN( fcyAmount ) ) fcyAmount = val

        data.FCY_AMOUNT = fcyAmount
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
      ref = exec ? exec[ 1 ].trim() : ''

    return [ ref, val.replace( ref, '' ).trim() ]
  }

  return parse
}
