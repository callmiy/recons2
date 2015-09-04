"use strict";

var interpolateProviderConfig = ['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');
}];

/**
 * Takes a file system path to a file (most likely a template path) and returns the server compatible path
 *
 * @param {string} appName - the name of the django app
 * @param {string} fsPath - relative path to a file resource on disk. The path must be relative to appName/js directory
 *   path
 * @returns {string} - a server compatible path
 */
function buildUrl(appName, fsPath) {
  return staticPrefix + appName + '/js/' + fsPath
}

module.exports = {
  interpolateProviderConfig: interpolateProviderConfig,

  buildUrl: buildUrl,

  rootAppName: 'core_recons'
}
