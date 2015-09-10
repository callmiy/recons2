"use strict";
/*jshint camelcase: false*/

angular
  .module('letterOfCreditApp')
  .controller('LetterOfCreditSearchController', LetterOfCreditSearchController)

LetterOfCreditSearchController.$inject = ['Customer', 'LetterOfCredit']

function LetterOfCreditSearchController(Customer, LetterOfCredit) {
  var vm = this;

  vm.foundLcees = []
  vm.searchParams = {released: ''}
  vm.getCustomer = getCustomer
  vm.searchLc = searchLc

  function searchLc(searchParams) {
    if (_.isEmpty(searchParams)) {
      return;
    }

    var queryParams = {};

    if (searchParams.lc_ref) {
      queryParams.lc_ref = searchParams.lc_ref;
    }

    if (searchParams.mf) {
      queryParams.mf = searchParams.mf;
    }

    if (searchParams.applicant) {
      queryParams.applicant = searchParams.applicant.name;
    }

    if (searchParams.released) {
      queryParams.released = searchParams.released;
    }

    vm.foundLcees = LetterOfCredit.query(queryParams);
  }

  function getCustomer(customerName) {
    return Customer.query({name: customerName}).$promise
  }
}
