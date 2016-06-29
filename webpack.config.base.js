"use strict";

var path = require( 'path' )

var webpackAliases = { commons: __dirname + '/app/app/index.js', }

var webpackTestConfig = {
  cache: true,
  debug: true,
  devtool: '@inline-source-map',

  resolve: {
    alias: webpackAliases
  },

  module: {
    postLoaders: [ {
      test: /\.js$/,
      exclude: /(spec\.js|node_modules\/|compiled\.js|compiled\.min\.js)/,
      loader: 'istanbul-instrumenter'
    } ]
  }
}

var appPath = path.join( __dirname, 'app', 'app' )

var webpackAppConfig = {
  cache: true,
  watch: true,
  entry: path.join( appPath, 'app.js' ),

  output: {
    path: appPath,
    filename: 'app.js'
  },

  externals: {
    'angular': 'angular'
  },

  module: {
    loaders: [
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loader: 'html' }
    ]
  },

  resolve: {
    alias: webpackAliases
  },

  node: {
    fs: "empty"
  }
}

module.exports = {
  webpackAppConfig: webpackAppConfig,
  webpackTestConfig: webpackTestConfig
}
