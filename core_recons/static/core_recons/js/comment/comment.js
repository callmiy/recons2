"use strict";

/*jshint camelcase:false*/

var app = angular.module('comment-service', ['rootApp'])

app.factory('Comment', Comment)
Comment.$inject = ['$resource', 'urls']
function Comment($resource, urls) {
  var url = appendToUrl(urls.commentAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}
