"use strict";

var services = angular.module('rootApp')

services.factory('getCurrencies', getCurrencies)
getCurrencies.$inject = ['$http', 'urls'];
function getCurrencies($http, urls) {
  return function(searchQuery) {
    return $http.get(urls.currencyAPIUrl, {
      params: {code: searchQuery}
    }).then(function(response) {
      return response.data;
    })
  }
}

services.factory('Customer', Customer);
Customer.$inject = ['$resource', 'urls'];
function Customer($resource, urls) {
  var url = appendToUrl(urls.customerAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

services.factory('parseDate', parseDate);
function parseDate() {
  return function(aDate) {
    //bid date is a date string and not datetime
    if ((typeof aDate === 'string') && /\d{4}-\d{2}-\d{2}/.test(aDate)) {
      return aDate;
    } else if (aDate instanceof Date) {
      return aDate.strftime('%Y-%m-%d');
    }

    return null;
  };
}

services.factory('LetterOfCredit', LetterOfCredit);
LetterOfCredit.$inject = ['$resource', 'urls'];
function LetterOfCredit($resource, urls) {
  var url = appendToUrl(urls.letterOfCredit1APIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

services.controller('XhrErrorDisplayCtrl', XhrErrorDisplayCtrl)
services.factory('xhrErrorDisplay', xhrErrorDisplay);

XhrErrorDisplayCtrl.$inject = ['$scope', 'error']

function XhrErrorDisplayCtrl($scope, error) {
  error = angular.copy(error);

  console.log(error);//TODO: remove console logging

  if (error.status === 400) {
    error.messages = error.data;
  }
  $scope.error = error;
}

xhrErrorDisplay.$inject = ['ModalService'];

function xhrErrorDisplay(ModalService) {
  return function handleError(errorObj) {
    ModalService.showModal({
      template: require('./xhr-error-display.service.html'),
      controller: 'XhrErrorDisplayCtrl',
      inputs: {error: errorObj}
    }).then(modalHandler);

    function modalHandler(modal) {
      modal.element.dialog({
        modal: true,
        dialogClass: 'no-close',
        title: 'Error ' + errorObj.status
      });
    }
  }
}
