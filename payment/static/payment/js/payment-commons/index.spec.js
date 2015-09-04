"use strict";

describe('paymentCommons tests', function() {

  var paymentCommons = require('.')

  describe('payment app name', function () {
    it('should properly define payment app name', function () {
      expect(paymentCommons.appName).toBe('payment')
    })
  })

  describe('buildUrl', function() {
    it('should resolve to the correct server url for the payment app', function() {
      expect(paymentCommons.buildUrl('path/to/template.html')).toBe('/static/' + paymentCommons.appName + '/js/path/to/template.html')
    })
  })
})
