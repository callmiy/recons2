"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('lc', [
  'ui.router',
  'model-table',
  'rootApp',
  'search-lc',
  'lc-detail'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(bidURLConfig)
bidURLConfig.$inject = ['$stateProvider']
function bidURLConfig($stateProvider) {
  $stateProvider
    .state('lc', {
      url: '/lc',

      kanmiiTitle: 'Letter of credit',

      templateUrl: require('lcAppCommons').buildUrl('lc/lc.html'),

      controller: 'LetterOfCreditController as lcHome'
    })
}

app.controller('LetterOfCreditController', LetterOfCreditController)
LetterOfCreditController.$inject = ['SearchLc', '$state']
function LetterOfCreditController(SearchLc, $state) {
  var vm = this

  vm.searchLc = function searchLc() {
    SearchLc.searchWithModal().then(function(data) {
      var results = data.results

      if (results.length) {
        if (results.length === 1) {
          var lc = results[0]
          $state.go('lc_detail', {lc_number: lc.lc_number, lc: lc})
        }
      }
    })
  }
}
