"use strict";

describe('root app commons', function() {

  describe('buildUrl', function() {
    it('should transform local url to server side url', function() {
      var commons = require('.')

      expect(commons.buildUrl('app-name', 'path/to/resource')).toBe('/static/app-name/js/path/to/resource')
    })
  })
})
