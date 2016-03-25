"use strict";

var app = angular.module('lc-cover-service', [
  'rootApp'
])

app.factory('FormMCover', FormMCover)
FormMCover.$inject = ['$resource', 'urls']
function FormMCover($resource, urls) {
  var url = appendToUrl(urls.formMCoverAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}
