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

app.factory('resetForm2', resetForm2)
function resetForm2() {

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

        //this is a hack required to clear form controls where ng-model is a complex object and the control did not
        // validate.
        obj.elements.forEach(function(element) {
          theForm[element].$$lastCommittedViewValue = ''
          theForm[element].$rollbackViewValue()
        })
      })
    }
  }

  return reset
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
