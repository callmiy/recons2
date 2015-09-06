"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('rootApp.search_lc', ['rootApp', 'rootApp.services'])

app.controller('SearchLcCtrl', SearchLcCtrl)

app.directive('searchLc', searchLc)

function searchLc() {

  function link(scope, el, attr, controller) {
    function reset(searchLcForm) {
      controller.searchParams = {}

      el.find('.form-control').each(function() {
        $(this).val('')
      })

      if (searchLcForm) {
        //console.log(searchLcForm.$error); return
        searchLcForm.$error = {}
        searchLcForm.$setPristine()
        searchLcForm.$setUntouched()
        searchLcForm.$invalid = false
      }
    }

    controller.reset = reset

    controller.reset()
  }

  return {
    restrict: 'E',

    scope: {},

    bindToController: true,

    templateUrl: rootCommons.buildUrl(rootCommons.rootAppName, 'search-lc/search-lc.html'),

    controller: 'SearchLcCtrl as searchLc',

    link: link
  }
}

SearchLcCtrl.$inject = ['getCustomers', 'LetterOfCredit']

function SearchLcCtrl(getCustomers, LetterOfCredit) {
  var vm = this;

  vm.lcees = []
  vm.searchParams = {}
  vm.getCustomers = getCustomers
  vm.getLcees = getLcees

  function getLcees(searchParams) {
    if (_.isEmpty(searchParams)) return

    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name

    vm.lcees = LetterOfCredit.query(searchParams)
    console.log(vm.lcees)
  }
}

app.directive('createNewPaymentSearchLc', createNewPaymentSearchLc)

function createNewPaymentSearchLc() {
  return {
    restrict: 'E',

    bindToController: true,

    templateUrl: rootCommons.buildUrl(rootCommons.rootAppName, 'create-new/create-new-payment-search.html'),

    controller: 'createNewPaymentSearchLcController as createNewPaymentSearch'
  }
}

app.controller('createNewPaymentSearchLcController', createNewPaymentSearchLcController)

createNewPaymentSearchLcController.$inject = ['$element']

function createNewPaymentSearchLcController(element) {
  /*jshint validthis:true*/
  var vm = this;
  vm.element = element
}
