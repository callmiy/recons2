"use strict";

/*jshint camelcase:false*/

var app = angular.module('upload-form-m-service', ['rootApp'])

app.factory('UploadFormM', UploadFormM)
UploadFormM.$inject = ['$resource', 'urls']
function UploadFormM($resource, urls) {
  var url = appendToUrl(urls.uploadedFormMAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      },
      getPaginated: {
        method: 'GET'
      }
    }
  )
}
