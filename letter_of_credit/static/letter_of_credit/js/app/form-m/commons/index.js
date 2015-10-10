"use strict";

var lcAppCommons = require('lcAppCommons')

/**
 * @description
 *
 * @param {String} fsPath - the path relative to the form-m directory
 * @returns {*|string}
 */
function buildUrl(fsPath) {
  return lcAppCommons.buildUrl('form-m') + '/' + fsPath
}

module.exports = {
  buildUrl: buildUrl
}
