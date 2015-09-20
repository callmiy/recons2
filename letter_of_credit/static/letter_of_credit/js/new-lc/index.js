"use strict";

/*jshint camelcase:false*/

var angular = require('angular')

angular
  .module('letterOfCreditApp')
  .controller('LetterOfCreditNewController', LetterOfCreditNewController);

LetterOfCreditNewController.$inject = [
  'getTypeAheadCustomer',
  'LetterOfCredit',
  'getTypeAheadCurrency',
  'parseDate',
  'xhrErrorDisplay',
  'LetterOfCreditStatuses',
  'urls'
];

function LetterOfCreditNewController(getTypeAheadCustomer, LetterOfCredit, getTypeAheadCurrency, parseBidDate, xhrErrorDisplay,
  LetterOfCreditStatuses, urls) {

  var vm = this;

  vm.getCustomers = getTypeAheadCustomer
  vm.getCurrencies = getTypeAheadCurrency
  vm.createNewLc = createNewLc
  vm.reset = reset;
  vm.newLc = {};
  vm.newLcees = [];

  function reset() {
    vm.newLc = null;
    vm.newLcForm.$setPristine();
  }

  function createNewLc(data) {

    var _data = angular.copy(data);//without this, applicant and ccy turn to urls in view

    _data.applicant = appendToUrl(urls.customerAPIUrl, _data.applicant.id);
    _data.ccy = appendToUrl(urls.currencyAPIUrl, _data.ccy.id);
    _data.bid_date = parseBidDate(_data.bid_date);

    var newLc = new LetterOfCredit(_data);

    newLc.$save(
      function(data) {
        vm.reset();
        vm.newLcees.unshift(data);

        if (_data.status) {createLcStatus(_data.status, data.url);}

      }, function(err) {
        xhrErrorDisplay(err);
      }
    );

    function createLcStatus(text, lcUrl) {
      new LetterOfCreditStatuses({
          text: text,
          lc: lcUrl
        }
      ).$save(function() {}, function(error) {
                xhrErrorDisplay(error);
              }
      );
    }
  }
}
