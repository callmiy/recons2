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

  return parse
}
