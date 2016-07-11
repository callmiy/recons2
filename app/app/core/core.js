"use strict";

var rootCommons = require( 'commons' )

angular.module( 'kanmii-underscore', [] ).factory( 'kanmiiUnderscore', function () {
  return window._
} )

angular.module( 'kanmii-URI', [] ).factory( 'kanmiiUri', function () {
  return window.URI
} )

var app = angular.module( 'rootApp', [
  'tradeApp', // defined in django template file 'recons-base.raw.html' - contains API URLs
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'ngMessages',
  'angularModalService',
  'toggle-dim-element'
] )

// start - angularize objects from nodejs
app.factory( 'moment', function () {
  return require( 'moment' )
} )

app.factory( 'underscore', function () {
  return require( 'underscore' )
} )

app.factory( 'baby', function () {
  return require( 'babyparse' )
} )
// end - angularize objects from nodejs

rootCommons.setStaticPrefix( app )

app.factory( 'resetForm', resetForm )
function resetForm() {

  /**
   * Resets an angular form to its pristine and untouched state. Clears all the form controls.
   *
   * @param form - an angular form instance
   * @param el - an angular element which wraps the form i.e the form is a descendant of the element
   * @param selector
   * @param cb - optional callback
   */
  function reset(form, el, selector, cb) {
    el.find( selector ).each( function () {
      $( this ).val( '' )
    } )

    //form.$error = {}
    form.$setPristine()
    form.$setUntouched()

    cb ? cb() : angular.noop() //jshint -W030
  }

  return reset
}

app.factory( 'clearFormField', clearFormField )

function clearFormField() {
  /**
   * this is a hack required to clear form controls where ng-model is a complex object and the control did not validate.
   */
  return function (form, fieldName) {
    if ( angular.isArray( fieldName ) ) {
      if ( fieldName[ 0 ] === 'file' ) {
        $( '[name=' + fieldName[ 1 ] + ']' ).val( null )
      }
      return
    }

    var field = form[ fieldName ]
    field.$$lastCommittedViewValue = ''
    field.$rollbackViewValue()
    field.$setPristine()
    field.$setUntouched()
  }
}

app.factory( 'resetForm2', resetForm2 )
resetForm2.$inject = [ 'clearFormField' ]
function resetForm2(clearFormField) {

  /**
   *
   * @param {angular.form} form - the global form (may contain children ng-forms)
   * @param {null|[]} clearForm - if present, it is an array of objects of the form:
   * {form: angular.form, elements: []} where elements are the string name of form control elements of the 'form' key.
   *   However, for elements such as file fields that are not handled by angular, the element will not be the string
   *   name but rather an array of the type ['elementType', 'elementName']. The type of the element (array index 0)
   *   will be used to determine how to handle this element - see factory `clearFormField` for details on how this is
   *   done.
   */
  function reset(form, clearForm) {
    form.$setPristine()
    form.$setUntouched()

    if ( clearForm ) {
      clearForm.forEach( function (obj) {
        var theForm = obj.form
        obj.elements.forEach( function (element) {
          clearFormField( theForm, element )
        } )
      } )
    }
  }

  return reset
}

app.factory( 'formFieldIsValid', formFieldIsValid )
function formFieldIsValid() {
  /**
   * A function whose return value is used to evaluate whether a form control element has error or success
   * @param {string} formName the name of the form
   * @param {string} formControl the name of a form control
   * @param {string|null} validity the type of validity to check for, 'ok' means valid while undefined means invalid
   * @returns {boolean}
   */

  return function ($scope, formName, formControl, validity) {
    var field = $scope[ formName ][ formControl ]
    return field.$dirty && field[ validity === 'ok' ? '$valid' : '$invalid' ]
  }
}

app.factory( 'getByKey', getByKey )
function getByKey() {
  /**
   * Searches a array of mapping and if list[key] == keyVal, returns the mapping for which the statement is true. If
   * the statement is not true for any member of the list, return null
   * @param {[]} list - array of the form [{}, {}, {},...]
   * @param {String|Number|*} key - a potential property of any of the member of the array
   * @param {String|Number|*} keyVal - the value of the property of a member of the array
   * @returns {{}|null}
   */
  function doGet(list, key, keyVal) {
    for ( var i = 0; i < list.length; i++ ) {
      var obj = list[ i ]
      if ( obj[ key ] == keyVal ) return obj // jshint ignore:line
    }

    return null
  }

  return doGet
}

app.directive( 'controlHasFeedback', controlHasFeedback )

function controlHasFeedback() {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      element.addClass( 'has-feedback' )
      var $input = element.find( attributes.controlSelector || '.form-control' )
      var $beforeFeedback = element.find( attributes.feedbackAfter )
      var $fieldBack = $( '<i class="form-control-feedback glyphicon"></i>' )

      if ( $beforeFeedback.size() ) {
        $fieldBack.insertAfter( $beforeFeedback )

        if ( $beforeFeedback.is( '.input-group-addon' ) ) $fieldBack.css( 'right', -2 )

      } else {
        $fieldBack.insertAfter( $input )
      }

      var $form = element.closest( '[ng-form]' )
      if ( !$form.size() ) $form = element.closest( 'form' )

      var field = scope[ $form.attr( 'name' ) ][ $input.prop( 'name' ) ]

      scope.$watch( function () {
        return field.$modelValue
      }, function () {
        if ( field.$dirty ) {
          if ( field.$valid ) {
            element.removeClass( 'has-error' ).addClass( 'has-success' )
            $fieldBack.removeClass( 'glyphicon-remove' ).addClass( 'glyphicon-ok' )

          } else {
            element.removeClass( 'has-success' ).addClass( 'has-error' )
            $fieldBack.removeClass( 'glyphicon-ok' ).addClass( 'glyphicon-remove' )
          }

          $fieldBack.show()
        }
      } )

      scope.$watch( function () {
        return field.$pristine
      }, function (pristine) {
        if ( pristine ) {
          element.removeClass( 'has-success has-error' )
          $fieldBack.removeClass( 'glyphicon-ok glyphicon-remove' ).hide()
        }
      } )
    }
  }
}

app.factory( 'toISODate', toISODate )
toISODate.$inject = [ 'moment' ]
function toISODate(moment) {
  return function (dtObj) {
    return dtObj ? moment( dtObj ).format( 'YYYY-MM-DD' ) : null
  }
}

require( './commons/toggle-dim-element' )
require( './customer/customer.js' )
require( './lc-bid-request/lc-bid-request.js' )
require( './consolidated-lc-bid-request/consolidated-lc-bid-request.js' )
require( './form-m/form-m.js' )
require( './lc/lc.js' )
require( './treasury-allocation/treasury-allocation.js' )
require( './comment/comment.js' )
require( './fx-deal/fx-deal.js' )
require( './attachment/attachment.js' )
require( './lc-cover/lc-cover.js' )
require( './upload-form-m/upload-form-m.js' )
require( './lc-issue/lc-issue.js' )
require( './commons/number-format.js' )
require( './commons/to-upper.js' )
require( './commons/toggle-bg-color' )
require( './pager-nav/pager-nav.js' )
require( './form-validators/form-validators.js' )
require( './model-table/model-table.js' )
require( './commons/commons.services.js' )
require( './search-lc' )
require( './confirmation-dialog/confirmation-dialog.js' )
require( './complex-object-validator/complex-object-validator.js' )
