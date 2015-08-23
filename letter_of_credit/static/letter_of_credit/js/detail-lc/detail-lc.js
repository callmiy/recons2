"use strict";

angular
  .module('letterOfCreditApp')
  .controller('LetterOfCreditDetailController', LetterOfCreditDetailController);

LetterOfCreditDetailController.$inject = [
  '$routeParams',
  'LetterOfCredit',
  'LetterOfCreditStatuses'];

function LetterOfCreditDetailController($routeParams,
  LetterOfCredit,
  LetterOfCreditStatuses) {
  var vm = this;
  LetterOfCredit.get({id: $routeParams.id}).$promise.then(success, failure);

  function success(data) {
    vm.lc = data;
    vm.lc.statuses_data = [];
    angular.forEach(data.statuses_id, function(statusId) {
      vm.lc.statuses_data.push(
        LetterOfCreditStatuses.get({id: statusId})
      );
    });
  }

  function failure(error) {
    console.log(error);
  }
}
