"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m-bid', [
  'ui.router',
  'model-table',
  'add-bid-service',
  'add-bid',
  'form-m-search-service',
  'lc-bid-request'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(bidURLConfig)
bidURLConfig.$inject = ['$stateProvider']
function bidURLConfig($stateProvider) {

  $stateProvider
    .state('bid', {
      url: '/bid',

      params: {newBid: null},

      kanmiiTitle: 'Bid Requests',

      template: require('./bid-request-home.html'),

      controller: 'BidRequestController as bidHome'
    })
}

app.controller('BidRequestController', BidRequestController)
BidRequestController.$inject = [
  'LcBidRequest',
  '$scope',
  'SearchFormMService',
  'lcBidRequestModelManager',
  '$http',
  '$stateParams'
]
function BidRequestController(LcBidRequest, scope, SearchFormMService, lcBidRequestModelManager, $http, stateParams) {
  var vm = this;

  vm.searchFormMs = searchFormMs
  function searchFormMs() {
    SearchFormMService.searchWithModal().then(function(data) {
      console.log(data);
    })
  }

  /**
   * The model manager will be used by the 'model-table' directive to manage the collection of bid requests retrieved
   * from the server
   * @type {[]}
   */
  vm.modelManager = lcBidRequestModelManager

  /**
   * The bids retrieved from backend. Will contain a list of bids and pagination hooks for
   * retrieving the next and previous sets of bids. This model is used by the display directive
   * to display the bids in a table
   * @type {object}
   */
  vm.bidRequests = []
  vm.paginationHooks = {}
  LcBidRequest.getPaginated().$promise.then(function(data) {
    updateBids(data)
  })

  /**
   * The 'new bid' model. When we create a new bid via the create/add bid directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */
  vm.newBid = null

  vm.receiveNewBid = receiveNewBid
  function receiveNewBid(newBid) {
    if (newBid) vm.bidRequests.unshift(newBid)
  }

  /**
   * The table caption for the 'model-table' directive
   * @type {string}
   */
  vm.tableCaption = 'Bid Requests'

  vm.getBidsOnNavigation = getBidsOnNavigation
  function getBidsOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      updateBids(response.data)
    })
  }

  /**
   * When the search-form-m directive returns, the result is propagated into this model
   * @type {null|object}
   */
  vm.searchedBidResult = null

  scope.$watch(function getSearchedBid() {return vm.searchedBidResult}, function fetchedSearchBid(searchedBidResult) {
    if (searchedBidResult) {
      updateBids(searchedBidResult)
    }
  })

  /**
   * Update the bid collection and pagination hooks
   * @param {object} data
   */
  function updateBids(data) {

    var results = data.results

    /**
     * if we are initializing this state with a new bid (because we are coming to this state from 'the create new bid
     * state'), then we first find out if the new bid is among those downloaded from the server. if it is one, we
     * delete it from the collection (because angular will complain if there are duplicate collection element) and
     * we mark it as pre-selected so that background of the row displaying the new bid can be highlighted
     */
    if (stateParams.newBid) {

      for (var bidIndex = 0; bidIndex < results.length; bidIndex++) {

        if (results[bidIndex].id === stateParams.newBid.id) {
          results.splice(bidIndex, 1)
          break
        }
      }

      stateParams.newBid.highlighted = true
      results.unshift(stateParams.newBid)
      stateParams.newBid = null
    }

    vm.bidRequests = results

    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
  }
}
