"use strict";

var rootCommons = require('commons')

var appName = 'letter_of_credit'

function buildUrl(fsPath) {
  return rootCommons.buildUrl(appName, fsPath)
}

module.exports = {
  buildUrl: buildUrl,
  appName: appName
}
