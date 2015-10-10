"use strict"

describe('letter of credit app commons', function() {
  var lcAppCommons = require('lcAppCommons')

  describe('buildUrl', function() {
    it('should transform local url to server side url', function() {
      expect(lcAppCommons.buildUrl('bid-request/display-pending-bid/display-pending-bid.html'))
        .toBe('/static/letter_of_credit/js/app/bid-request/display-pending-bid/display-pending-bid.html')
    })
  })
})
