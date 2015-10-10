"use strict";

var lcCommons = require('lcCommons')

/**
 * @description
 *
 * @param {String} fsPath - the path relative to the form-m directory
 * @returns {*|string}
 */
function buildUrl(fsPath) {
  return lcCommons.buildUrl('app') + '/' + fsPath
}

module.exports = {
  buildUrl: buildUrl
}
