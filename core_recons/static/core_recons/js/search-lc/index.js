"use strict";

var rootCommons = require('commons')

var app = angular.module('rootApp.search_lc', ['rootApp'])

app.controller('SearchLcCtrl', SearchLcCtrl)

app.directive('searchLc', searchLc)

function searchLc() {
  return {
    restrict: 'E',

    bindToController: true,

    templateUrl: rootCommons.buildUrl(rootCommons.rootAppName, 'search-lc/search-lc.html'),

    controller: 'SearchLcCtrl',

    controllerAs: 'searchLc'
  }
}

//CreateNewPaymentCtrl.$inject = ['$element']

function SearchLcCtrl() {
  //var vm = this;
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
