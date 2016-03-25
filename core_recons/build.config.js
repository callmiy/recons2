"use strict";

/*jshint camelcase:false*/

var path = require('path')
var deepCopy = require('deepcopy')
var baseConfig = deepCopy(require('../webpack.config.base').webpackBaseConfig)

var rootApp = path.join(__dirname, 'static', 'core_recons')
var destDir = path.join(rootApp, 'js')
var entryFileName = 'app.js'
var destFileName = 'app.js'
var destFilePath = path.join(destDir, destFileName)
var entry = path.join(destDir, entryFileName)
var jsMinify = [entry]

var webpackConfig = {
  cache: true,
  watch: true,
  entry: entry,

  output: {
    path: destDir,
    filename: destFileName
  }
}

for (var key in baseConfig) {
  if (baseConfig.hasOwnProperty(key)) webpackConfig[key] = baseConfig[key]
}

   module.exports = {
  destDir: destDir,
  base: rootApp,
  entry: entry,
  webpackConfig: webpackConfig,
  jsMinify: jsMinify,
  destFilePath: destFilePath
}
