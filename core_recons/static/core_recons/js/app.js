"use strict";

var rootCommons = require('commons')

angular.module('kanmii-underscore', []).factory('kanmiiUnderscore', function() { return window._ })

angular.module('kanmii-URI', []).factory('kanmiiUri', function() { return window.URI })

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'ngMessages',
  'angularModalService',
  'toggle-dim-element'
])
rootCommons.setStaticPrefix(app)

app.factory('resetForm', resetForm)
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
    el.find(selector).each(function() {
      $(this).val('')
    })

    //form.$error = {}
    form.$setPristine()
    form.$setUntouched()

    cb ? cb() : angular.noop() //jshint -W030
  }

  return reset
}

app.factory('clearFormField', clearFormField)
function clearFormField() {
  /**
   * this is a hack required to clear form controls where ng-model is a complex object and the control did not validate.
   */
  return function(form, field) {
    form[field].$$lastCommittedViewValue = ''
    form[field].$rollbackViewValue()
  }
}

app.factory('resetForm2', resetForm2)
resetForm2.$inject = ['clearFormField']
function resetForm2(clearFormField) {

  /**
   *
   * @param {angular.form} form - the global form (may contain children ng-forms)
   * @param {null|[]} clearForm - if present, it is an array of objects of the form:
   * {form: angular.form, elements: []} where elements are the form control elements of the 'form' key
   */
  function reset(form, clearForm) {
    form.$setPristine()
    form.$setUntouched()

    if (clearForm) {
      clearForm.forEach(function(obj) {
        var theForm = obj.form
        obj.elements.forEach(function(element) {
          clearFormField(theForm, element)
        })
      })
    }
  }

  return reset
}

app.factory('formFieldIsValid', formFieldIsValid)
function formFieldIsValid() {
  /**
   * A function whose return value is used to evaluate whether a form control element has error or success
   * @param {string} form the name of the form
   * @param {string} name the name of a form control
   * @param {string|null} validity the type of validity to check for, 'ok' means valid while undefined means invalid
   * @returns {boolean}
   */

  return function($scope, form, name, validity) {
    var field = $scope[form][name]
    return field.$dirty && field[validity === 'ok' ? '$valid' : '$invalid']
  }
}

require('./commons/toggle-dim-element')
require('./customer/customer.js')
require('./lc-bid-request/lc-bid-request.js')
require('./form-m/form-m.js')
require('./lc/lc.js')
require('./upload-form-m/upload-form-m.js')
require('./lc-issue/lc-issue.js')
require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/toggle-bg-color')
require('./pager-nav/pager-nav.js')
require('./form-validators/form-validators.js')
require('./model-table/model-table.js')
require('./commons/commons.services.js')
require('./search-lc')
require('./confirmation-dialog/confirmation-dialog.js')
