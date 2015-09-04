"use strict";

angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'angularModalService'
])

require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./search-lc')
