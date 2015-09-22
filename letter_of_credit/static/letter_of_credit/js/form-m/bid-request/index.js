"use strict";

var rootCommons = require('commons')

require('./table')

var app = angular.module('form-m-bid', ['ui.router', 'form-m-bid-request-display'])

app.config(rootCommons.interpolateProviderConfig)

app.config(bidURLConfig)
bidURLConfig.$inject = ['$stateProvider']
function bidURLConfig($stateProvider) {

  $stateProvider
    .state('bid', {
      url: '/bid',

      template: require('./index.html'),

      controller: 'BidRequestController as bidHome'
    })
}

app.controller('BidRequestController', BidRequestController)
BidRequestController.$inject = ['LcBidRequest', '$scope']
function BidRequestController(LcBidRequest, scope) {
  var vm = this;

  /**
   * The form Ms retrieved from backend. Will contain a list of form Ms and pagination hooks for
   * retrieving the next and previous sets of form Ms. This model is used by the display directive
   * to display the form Ms in a table
   * @type {object}
   */
  vm.bidRequests = LcBidRequest.getPaginated()

  /**
   * The 'new form M' model. When we create a new form M via the create/add form M directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */
  vm.newBidRequest = null

  /**
   * When the search-form-m directive returns, the result is propagated into this model
   * @type {null|object}
   */
  vm.searchedBidResult = null

  scope.$watch(function getSearchedBid() {return vm.searchedBidResult}, function fetchedSearchBid(searchedBidResult) {
    if (searchedBidResult) {
      vm.bidRequests = searchedBidResult
    }
  })
}
