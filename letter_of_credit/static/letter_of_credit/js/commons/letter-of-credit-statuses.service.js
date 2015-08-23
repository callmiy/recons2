"use strict";

angular
  .module('letterOfCreditApp')
  .factory('LetterOfCreditStatuses', LetterOfCreditStatuses);

LetterOfCreditStatuses.$inject = ['$resource', 'urls'];

function LetterOfCreditStatuses($resource, urls) {
  var url = appendToUrl(urls.letterOfCreditStatusesAPIUrl, ':id');
  return $resource(url, {id: '@id'});
}
