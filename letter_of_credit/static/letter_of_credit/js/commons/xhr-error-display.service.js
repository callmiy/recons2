"use strict";

var angular = require('angular')

angular
  .module('letterOfCreditApp')
  .controller('XhrErrorDisplayCtrl', XhrErrorDisplayCtrl)
  .factory('xhrErrorDisplay', xhrErrorDisplay);

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
      controller : 'XhrErrorDisplayCtrl',
      inputs     : {error: errorObj}
    }).then(modalHandler);

    function modalHandler(modal) {
      modal.element.dialog({
        modal      : true,
        dialogClass: 'no-close',
        title      : 'Error ' + errorObj.status
      });
    }
  }
}
