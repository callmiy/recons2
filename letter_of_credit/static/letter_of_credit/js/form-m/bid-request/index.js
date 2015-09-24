"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m-bid', [
  'ui.router',
  'model-table',
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

      kanmiiTitle: 'Bid Requests',

      template: require('./index.html'),

      controller: 'BidRequestController as bidHome'
    })
}

app.controller('BidRequestController', BidRequestController)
BidRequestController.$inject = [
  'LcBidRequest',
  '$scope',
  'SearchFormMService',
  '$filter',
  '$http'
]
function BidRequestController(LcBidRequest, scope, SearchFormMService, $filter, $http) {
  var vm = this;

  vm.searchFormMs = searchFormMs
  function searchFormMs() {
    SearchFormMService.searchWithModal().then(function(data) {
      console.log(data);
    })
  }

  var numberCssStyle = {'text-align': 'right'}

  /**
   * The model manager will be used by the 'model-table' directive to manage the collection of bid requests retrieved
   * from the server
   * @type {[]}
   */
  vm.modelManager = [
    {
      title: 'Form M', modelKey: 'form_m_number'
    },

    {
      title: 'Applicant', modelKey: 'applicant'
    },

    {
      title: 'Currency', modelKey: 'currency'
    },

    {
      title: 'Amount', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('number')(model.amount, 2)
      }
    },

    {
      title: 'Date Created', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('date')(model.created_at, 'dd-MMM-yyyy')
      }
    },

    {
      title: 'Date Requested', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('date')(model.requested_at, 'dd-MMM-yyyy')
      }
    }
  ]

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
    vm.bidRequests = data.results

    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
  }
}
