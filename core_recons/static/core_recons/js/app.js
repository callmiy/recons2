"use strict";

var rootCommons = require('commons')

var underscore = angular.module('kanmii-underscore', []);
underscore.factory('kanmiiUnderscore', function() {
  return window._
});

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'angularModalService'
])
rootCommons.setStaticPrefix(app)

app.factory('resetForm', resetForm)
function resetForm() {

  /**
   * Resets an angular form to its pristine and untouched state. Clears all the form controls.
   *
   * @param form - an angular form instance
   * @param el - an angular element which wraps the form i.e the form is a descendant of the element
   * @param controlCssClass - a unique class name for all controls of the form we wish to reset
   * @param cb - optional callback
   */
  function reset(form, el, controlCssClass, cb) {
    el.find('.' + controlCssClass).each(function() {
      $(this).val('')
    })

    //form.$error = {}
    form.$setPristine()
    form.$setUntouched()

    cb ? cb() : angular.noop()
  }

  return reset
}

require('./add-customer')
require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/commons.services.js')
require('./search-lc')
