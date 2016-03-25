"use strict";

describe( 'root app commons', function () {
  var commons = require( './index.js' )

  describe( 'buildUrl', function () {
    it( 'should transform local url to server side url', function () {
      expect( commons.buildUrl( 'app-name', 'path/to/resource' ) ).toBe( '/static/app/app-name/path/to/resource' )
    } )
  } )
} )
