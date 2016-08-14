"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation' )

app.factory( 'saveBlotter', saveBlotter )

saveBlotter.$inject = [
  '$q',
  'toISODate',
  'TreasuryAllocation',
  'underscore'
]

function saveBlotter($q, toISODate, TreasuryAllocation, underscore) {

  /**
   *
   * @param {[]} dataList
   */
  function save(dataList) {
    var dataClone, dataToSave, deferred = $q.defer()

    dataToSave = dataList.map( function (data) {
      dataClone = angular.copy( data )
      dataClone.deal_date = toISODate( dataClone.deal_date )
      dataClone.settlement_date = toISODate( dataClone.settlement_date )

      return dataClone

    } )

    TreasuryAllocation.saveMany( dataToSave ).$promise.then( function (savedDataList) {

      deferred.resolve( savedDataList )

    }, function (xhr) {

      console.log( 'saving blotter xhr = ', xhr );

      if ( xhr.status === 400 ) {
        deferred.reject( handleSave400Error( xhr.data, dataToSave ) )
      }

    } )

    return deferred.promise
  }

  /**
   * For a 400 xhr error, extract all the errors and put in a an array, then return array of errors. If no error,
   * return null.
   *
   * @param {{}} errorObj
   * @param {{}} rejectedData
   * @returns {null|Array}
   */
  function extract400Errors(errorObj, rejectedData) {
    if ( underscore.isEmpty( errorObj ) ) return null

    var errorList = []

    if ( underscore.has( errorObj, 'non_field_errors' ) ) {
      errorObj.non_field_errors.forEach( function (error) {
        errorList.push( error )
      } )

      delete errorObj.non_field_errors
    }

    underscore.each( errorObj, function (val, key) {
      if ( underscore.has( rejectedData, key ) ) {

        val.forEach( function (theVal) {
          errorList.push( key + ' - ' + theVal )
        } )
      }
    } )

    return errorList
  }

  /**
   *
   * @param {[]} errorList
   * @param {[]} rejectedDataList
   * @return {[]}
   */
  function handleSave400Error(errorList, rejectedDataList) {
    var i, errorObj, rejectedData, errors

    for ( i = 0; i < errorList.length; i++ ) {
      errorObj = errorList[ i ]
      rejectedData = rejectedDataList[ i ]
      errors = extract400Errors( errorObj, rejectedData )

      if ( errors ) rejectedData.errors = errors
    }

    return rejectedDataList
  }

  return save
}
