"use strict";

var rootCommons = require('commons')

var appName = 'payment'

function buildUrl(fsPath) {
  return rootCommons.buildUrl(appName, fsPath)
}

module.exports = {
  appName: 'payment',
  buildUrl: buildUrl
}
