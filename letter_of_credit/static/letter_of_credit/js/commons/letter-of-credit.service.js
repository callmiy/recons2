"use strict";

angular
  .module('letterOfCreditApp')
  .factory('LetterOfCredit', LetterOfCredit);

LetterOfCredit.$inject = ['$resource', '$http', 'urls'];

function LetterOfCredit($resource, $http, urls) {
  var url = appendToUrl(urls.letterOfCreditAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  );
}
