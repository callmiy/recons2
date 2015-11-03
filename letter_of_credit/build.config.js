"use strict";

/*jshint camelcase:false*/

var path = require('path')
var baseConfig = require('../webpack.config.base').webpackBaseConfig

var letterOfCredit = path.join(__dirname, 'static', 'letter_of_credit')
var entry = path.join(letterOfCredit, 'js', 'app', 'app.js')
var destDir = path.join(letterOfCredit, 'js', 'app')
var jsMinify = [
  path.join(letterOfCredit, 'js', 'lc-register-upload.js'),
  path.join(letterOfCredit, 'js', 'uploaded-form-m', 'uploaded-form-m.js')
]

var webpackConfig = {
  entry: entry,

  output: {
    path: destDir,
    filename: 'app.js'
  },

  resolve: {
    root: [letterOfCredit]
  }
}

for (var key in baseConfig) {
  if (baseConfig.hasOwnProperty(key)) webpackConfig[key] = baseConfig[key]
}

module.exports = {
  destDir: destDir,
  base: letterOfCredit,
  entry: entry,
  webpackConfig: webpackConfig,
  jsMinify: jsMinify
}
