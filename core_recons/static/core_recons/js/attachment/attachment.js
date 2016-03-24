"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'attachment-service', ['rootApp'] )

app.factory( 'Attachment', Attachment )
Attachment.$inject = ['$resource', 'urls']

function Attachment($resource, urls) {
  var url = appendToUrl( urls.attachmentAPIUrl, ':id' );
  return $resource( url, { id: '@id' }, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

require( './add-attachment/add-attachment.js' )
