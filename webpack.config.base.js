"use strict";

var webpackExternals = {
  'angular': 'angular'
}

var webpackAliases = {
  commons: __dirname + '/core_recons/static/core_recons/js/commons',
  lcCommons: __dirname + '/letter_of_credit/static/letter_of_credit/js/commons',
  formMCommons: __dirname + '/letter_of_credit/static/letter_of_credit/js/form-m/commons'
}

var webpackTestConfig = {
  cache: true,
  debug: true,
  devtool: '@inline-source-map',

  resolve: {
    alias: webpackAliases
  },

  module: {
    postLoaders: [{
      test: /\.js$/,
      exclude: /(spec\.js|node_modules\/|compiled\.js|compiled\.min\.js)/,
      loader: 'istanbul-instrumenter'
    }]
  }
}

var webpackBaseConfig = {
  cache: true,
  watch: true,

  externals: webpackExternals,

  module: {
    loaders: [
      {test: /\.html$/, loader: 'html'}
    ]
  },

  resolve: {
    alias: webpackAliases
  }
}

module.exports = {
  webpackBaseConfig: webpackBaseConfig,
  webpackTestConfig: webpackTestConfig
}
