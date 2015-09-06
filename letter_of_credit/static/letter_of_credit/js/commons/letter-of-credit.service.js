"use strict";

angular
  .module('letterOfCreditApp')
  .factory('LetterOfCredit', LetterOfCredit);

LetterOfCredit.$inject = ['$resource', 'urls'];

function LetterOfCredit($resource, urls) {
  var url = appendToUrl(urls.letterOfCreditAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  );
}
