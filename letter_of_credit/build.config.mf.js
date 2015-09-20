"use strict";

/*jshint camelcase:false*/

var path = require('path')
var baseConfig = require('../webpack.config.base').webpackBaseConfig

var app = path.join(__dirname, 'static', 'letter_of_credit', 'js', 'form-m')
var entry = path.join(app, 'app.js');
var destDir = app
var jsMinify = [entry]

var webpackConfig = {
  entry: entry,

  output: {
    path: destDir,
    filename: 'app.js'
  },

  resolve: {
    root: [app]
  }
}

for (var key in baseConfig) {
  if (baseConfig.hasOwnProperty(key)) webpackConfig[key] = baseConfig[key]
}

module.exports = {
  destDir: destDir,
  base: app,
  entry: entry,
  webpackConfig: webpackConfig,
  jsMinify: jsMinify
}
