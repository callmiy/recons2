"use strict";

describe('root app commons', function() {
  var commons = require('.')

  describe('rootAppName', function () {
    it('should properly define root app name', function () {
      expect(commons.rootAppName).toBe('core_recons')
    })
  })

  describe('buildUrl', function() {
    it('should transform local url to server side url', function() {
      expect(commons.buildUrl('app-name', 'path/to/resource')).toBe('/static/app-name/js/path/to/resource')
    })
  })
})
