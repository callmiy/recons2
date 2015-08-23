"use strict";

/*jshint camelcase:false*/

var path = require('path')
var baseConfig = require('../webpack.config.base')

var payment = path.join(__dirname, 'static', 'payment')
var entry = path.join(payment, 'js', 'app.js');
var destDir = path.join(payment, 'js');
var jsMinify = [
  path.join(payment, 'js', 'app.js')
]

var webpackConfig = {
  entry: entry,

  output: {
    path: destDir,
    filename: 'app.js'
  }
}

for (var key in baseConfig) {
  if (baseConfig.hasOwnProperty(key)) webpackConfig[key] = baseConfig[key]
}

module.exports = {
  destDir: destDir,
  base: payment,
  entry: entry,
  webpackConfig: webpackConfig,
  jsMinify: jsMinify
}
