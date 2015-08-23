"use strict";

var paymentCommons = require('.')

describe('paymentCommons tests', function() {

  describe('buildUrl', function() {
    Object.defineProperty(window, 'staticPrefix', {value: '/static/'})

    it('should resolve to the correct server url for the payment app', function() {
      expect(paymentCommons.buildUrl('path/to/template.html')).toBe('/static/payment/js/path/to/template.html')
    })
  })
})
