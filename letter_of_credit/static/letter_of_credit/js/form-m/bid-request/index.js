"use strict";

var rootCommons = require('commons')

var app = angular.module('form-m-bid', [
  'ui.router',
  'form-m-bid-request-display',
  'add-bid',
  'form-m-search-service'
])

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
BidRequestController.$inject = ['LcBidRequest', '$scope', 'SearchFormMService']
function BidRequestController(LcBidRequest, scope, SearchFormMService) {
  var vm = this;

  vm.searchFormMs = searchFormMs
  function searchFormMs() {
    SearchFormMService.searchWithModal().then(function(data) {
      console.log(data);
    })
  }

  /**
   * The bids retrieved from backend. Will contain a list of bids and pagination hooks for
   * retrieving the next and previous sets of bids. This model is used by the display directive
   * to display the bids in a table
   * @type {object}
   */
  vm.bidRequests = LcBidRequest.getPaginated()

  /**
   * The 'new bid' model. When we create a new bid via the create/add bid directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */
  vm.newBid = null

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
