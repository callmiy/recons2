"use strict";

var paymentCommons = require('.')

describe('paymentCommons tests', function() {

  describe('buildUrl', function() {
    it('should resolve to the correct server url for the payment app', function() {
      expect(paymentCommons.buildUrl('path/to/template.html')).toBe('/static/' + paymentCommons.appName + '/js/path/to/template.html')
    })
  })
})
