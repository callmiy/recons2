"use strict";
/*jshint camelcase: false*/

var angular = require('angular')

angular
  .module('letterOfCreditApp')
  .controller('LetterOfCreditSearchController', LetterOfCreditSearchController);

LetterOfCreditSearchController.$inject = ['getCustomers', 'LetterOfCredit'];

function LetterOfCreditSearchController(getCustomers, LetterOfCredit) {
  var vm = this;

  vm.foundLcees = [];
  vm.searchParams = {released: ''};
  vm.getCustomers = getCustomers;
  vm.searchLc = searchLc;

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
}
