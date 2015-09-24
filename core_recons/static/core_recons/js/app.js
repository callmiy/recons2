"use strict";

var rootCommons = require('commons')

angular
  .module('kanmii-underscore', [])
  .factory('kanmiiUnderscore', function() {
             return window._
           })

angular
  .module('kanmii-URI', [])
  .factory('kanmiiUri', function() {
             return window.URI
           })

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
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

    cb ? cb() : angular.noop()
  }

  return reset
}

require('./commons/toggle-dim-element')
require('./add-customer')
require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/toggle-bg-color')
require('./commons/pager-nav')
require('./commons/model-table')
require('./commons/commons.services.js')
require('./search-lc')
