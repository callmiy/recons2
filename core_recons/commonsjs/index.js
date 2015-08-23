"use strict";

var interpolateProviderConfig = ['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');
}];

module.exports = {
  interpolateProviderConfig: interpolateProviderConfig
}
