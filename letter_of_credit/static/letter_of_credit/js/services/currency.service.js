"use strict";

angular
  .module('letterOfCreditApp')
  .factory('getCurrencies', getCurrencies);

getCurrencies.$inject = ['$http', 'urls'];

function getCurrencies($http, urls) {
  return function(searchQuery) {
    return $http.get(urls.currencyAPIUrl, {
      params: {code: searchQuery}
    }).then(function(response) {
      return response.data;
    });
  };
}
