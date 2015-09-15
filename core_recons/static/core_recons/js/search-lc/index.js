"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('rootApp.search_lc', ['rootApp'])
app.config(rootCommons.interpolateProviderConfig)
rootCommons.setStaticPrefix(app)

app.directive('searchLc', searchLcDirective)

searchLcDirective.$inject = ['resetForm']

function searchLcDirective(resetForm) {

  function link(scope, el, attr, controller) {
    function reset(searchLcForm) {
      controller.searchParams = {}

      if (searchLcForm) {
        resetForm(searchLcForm, el, 'form-control')
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

    controller: 'SearchLcDirectiveCtrl as searchLc',

    link: link
  }
}

app.controller('SearchLcDirectiveCtrl', SearchLcDirectiveCtrl)
SearchLcDirectiveCtrl.$inject = ['Customer', 'LetterOfCredit']
function SearchLcDirectiveCtrl(Customer, LetterOfCredit) {
  var vm = this;

  vm.cssPath = rootCommons.buildUrl(rootCommons.rootAppName, 'search-lc/search-lc.min.css')
  vm.lcees = []
  vm.searchParams = {}
  vm.getCustomer = getCustomer
  vm.getLcees = getLcees

  function getCustomer(customerName) {
    return Customer.query({name: customerName}).$promise
  }

  function getLcees(searchParams) {
    if (_.isEmpty(searchParams)) return //:TODO - tell user that search query matches nothing on server

    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name

    vm.lcees = LetterOfCredit.query(searchParams)
    console.log(vm.lcees)
  }
}
