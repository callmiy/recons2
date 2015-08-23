"use strict";

/**
 * Takes a file system path to a file (most likely a template path) and returns the server compatible path
 * @param {string} fsPath - relative path to a file resource on disk. The path must be relative to ./.. (i.e js
 *   directory) path
 * @returns {string} - a server compatible path
 */
function buildUrl(fsPath) {

  return staticPrefix + 'payment/js/' + fsPath
}

module.exports = {
  buildUrl: buildUrl
}
