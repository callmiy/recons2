"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m-bid', [
  'ui.router',
  'model-table',
  'display-pending-bid',
  'add-bid-service',
  'add-bid',
  'form-m-search-service',
  'lc-bid-request',
  'rootApp',
  'kanmii-URI',
  'kanmii-underscore'
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
  '$stateParams',
  'kanmiiUri',
  'urls',
  'kanmiiUnderscore',
  'formatDate',
  'xhrErrorDisplay',
  '$state',
  '$timeout'
]
function BidRequestController(LcBidRequest, scope, SearchFormMService, lcBidRequestModelManager, $http,
  stateParams, kanmiiUri, urls, kanmiiUnderscore, formatDate, xhrErrorDisplay, $state, $timeout) {
  var vm = this;

  initialize()
  function initialize() {
    vm.newBid = null

    /**
     * When the search-form-m directive returns, the result is propagated into this model
     * @type {null|object}
     */
    vm.searchedBidResult = null

    vm.selectedBids = {}

    vm.selectedDownloadedBids = {}
  }

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
  LcBidRequest.pending().$promise.then(function(data) {
    updateBids(data)
  })

  /**
   * The 'new bid' model. When we create a new bid via the create/add bid directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */

  vm.receiveNewBid = receiveNewBid
  function receiveNewBid(newBid) {
    if (newBid) vm.bidRequests.unshift(newBid)
  }

  /**
   * The table caption for the 'model-table' directive
   * @type {string}
   */
  vm.tableCaption = 'Pending Bids'

  vm.getBidsOnNavigation = getBidsOnNavigation
  function getBidsOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      updateBids(response.data)
    })
  }

  scope.$watch(function searchedBidResult() {return vm.searchedBidResult},
               function searchedBidResultChanged(searchedBidResult) {
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
     * delete it from the collection (because angular will complain if there are duplicate collection elements) and
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

  var url = kanmiiUri(urls.lcBidRequestDownloadUrl)
  vm.downloadUrl = function downloadUrl() {
    if (!kanmiiUnderscore.isEmpty(vm.selectedBids)) {
      var search = []

      kanmiiUnderscore.each(vm.selectedBids, function(selection, bidId) {
        if (selection === true) search.push(bidId)
      })

      return url.search({bid_ids: search}).toString()
    }
  }

  vm.downloadBtnDisabled = function downloadBtnDisabled() {
    if (kanmiiUnderscore.isEmpty(vm.selectedBids)) return true

    return !kanmiiUnderscore.any(vm.selectedBids, function(selectionVal) {
      return selectionVal === true
    })
  }

  vm.onSelectedBidsChanged = onSelectedBidsChanged
  function onSelectedBidsChanged(newSelections) {
    if (newSelections && !kanmiiUnderscore.isEmpty(newSelections)) {
      kanmiiUnderscore.each(newSelections, function(checked, bidId) {
        var bid = getBidFromId(bidId)

        if (bid && bid.downloaded) vm.selectedDownloadedBids[bidId] = checked
      })
    }
  }

  vm.markRequestedBtnDisabled = function markRequestedBtnDisabled() {
    if (kanmiiUnderscore.isEmpty(vm.selectedDownloadedBids)) return true

    //return true if un-downloaded bid is checked
    //return false if there is at least one downloaded bid checked
    var anyNoneDownloadedChecked = kanmiiUnderscore.any(vm.selectedBids, function(checked, bidId) {
      return !kanmiiUnderscore.has(vm.selectedDownloadedBids, bidId) && checked === true
    })

    if (anyNoneDownloadedChecked) return true
    else return !kanmiiUnderscore.any(vm.selectedDownloadedBids, function(checked) {
      return checked === true
    })
  }

  vm.markRequested = function markRequested() {
    kanmiiUnderscore.each(vm.selectedDownloadedBids, function(checked, bidId) {
      if (!checked) return

      var bid = getBidFromId(bidId)
      if (bid) {
        bid.requested_at = formatDate(new Date())
        LcBidRequest.put(bid).$promise.then(bidEditSuccess, bidEditFailure)
      }
    })

    initialize()

    function bidEditSuccess(editedBid) {
      vm.bidRequests = vm.bidRequests.filter(function(bid) {
        return bid.id !== editedBid.id
      })
    }

    function bidEditFailure(xhr) {xhrErrorDisplay(xhr)}
  }

  vm.refreshPage = function refreshPage() {
    $timeout(function() {$state.reload()}, 3000)
  }

  function getBidFromId(bidId) {
    for (var index = 0; index < vm.bidRequests.length; index++) {
      var bid = vm.bidRequests[index]
      if (bid.id === +bidId) return bid
    }

    return null
  }
}