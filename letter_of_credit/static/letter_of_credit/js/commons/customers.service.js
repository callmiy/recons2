"use strict";

angular
  .module('letterOfCreditApp')
  .factory('getCustomers', getCustomers);

getCustomers.$inject = ['$http', 'urls'];
function getCustomers($http, urls) {
  return function(searchQuery) {
    return $http.get(urls.customerAPIUrl, {
      params: {name: searchQuery}
    }).then(function(response) {
      return response.data;
    });
  };
}
