"use strict";

module.exports = {
  cache: true,
  watch: true,

  externals: {
    'angular': 'angular'
  },

  module: {
    loaders: [
      {test: /\.html$/, loader: 'html'}
    ]
  }
}
