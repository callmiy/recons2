"use strict";

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'angularModalService'
])

app.directive('addCustomer', function () {
  return {
    restrict: 'A',
    link: function (scope, elm, attrs) {
      elm
        .css({cursor: 'pointer'})
        .bind('click', function () {
          console.log('am clicked');
        })
    }
  }
})

require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/commons.services.js')
require('./search-lc')
