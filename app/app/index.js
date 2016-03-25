"use strict";

var interpolateProviderConfig = ['$interpolateProvider', function ($interpolateProvider) {
  $interpolateProvider.startSymbol( '{$' );
  $interpolateProvider.endSymbol( '$}' );
}];

/**
 * Takes a file system path to a file (most likely a template path) and returns the server compatible path. For
 * instance a file that lives at ./my-folder/another-folder/file.ext will be called like so:
 * buildUrl('my-folder', 'another-folder/file.ext')
 *
 * @param {string} appName - the folder name after ./app/app.
 * @param {string} fsPath - relative path to a file resource on disk. The path must be relative to
 *  ./appName folder
 * @returns {string} - a server compatible path
 */
function buildUrl(appName, fsPath) {
  return staticPrefix + 'app/' + appName + '/' + fsPath
}

/**
 * sets the static root on an angular app - so we can use a variable in our views rather hard-coding the static root
 * value
 * @param {angular.module} app the angular module on which we wish to set the static root
 */
function setStaticPrefix(app) {
  app.run( ['$rootScope', function ($rootScope) {
    $rootScope.staticPrefix = staticPrefix
    $rootScope.addIconSrc = staticPrefix + 'core_recons/css/images/icon_addposting.gif'
  }] )
}

module.exports = {
    interpolateProviderConfig: interpolateProviderConfig,
  buildUrl: buildUrl,
  setStaticPrefix: setStaticPrefix
}
