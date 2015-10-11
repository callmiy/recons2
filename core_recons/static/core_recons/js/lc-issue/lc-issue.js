"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-issue-service', ['rootApp'])

app.factory('LCIssue', LCIssue)
LCIssue.$inject = ['$resource', 'urls']
function LCIssue($resource, urls) {
  var url = appendToUrl(urls.lcIssueAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

app.factory('LCIssueConcrete', LCIssueConcrete)
LCIssueConcrete.$inject = ['$resource', 'urls']
function LCIssueConcrete($resource, urls) {
  var url = appendToUrl(urls.lcIssueConcreteAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

app.factory('getTypeAheadLCIssue', getTypeAheadLCIssue)
getTypeAheadLCIssue.$inject = ['LCIssue']
function getTypeAheadLCIssue(LCIssue) {

  function getLCIssue(params) {
    return LCIssue.query(params).$promise
  }

  return getLCIssue
}
