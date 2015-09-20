"use strict";

var lcCommons = require('lcCommons')

describe('letter of credit app commons', function() {

  describe('buildUrl', function() {
    it('should display the url', function() {
      expect(lcCommons.buildUrl('fake-path')).toBe('/static/letter_of_credit/js/fake-path')
    })
  })
})
