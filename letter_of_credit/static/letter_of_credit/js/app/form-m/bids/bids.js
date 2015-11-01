"use strict";

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m-bids', [
  'ui.router',
  'lc-bid-request',
  'rootApp',
  'kanmii-URI',
  'kanmii-underscore',
  'form-m-service'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(bidURLConfig)
bidURLConfig.$inject = ['$stateProvider']
function bidURLConfig($stateProvider) {

  $stateProvider
    .state('form_m.bids', {

      kanmiiTitle: 'Bids',

      views: {
        bids: {
          template: require('./bids.html'),

          controller: 'BidRequestController as bidHome'
        }
      }
    })
}

app.controller('BidRequestController', BidRequestController)
BidRequestController.$inject = [
  'LcBidRequest',
  '$scope',
  '$http',
  'kanmiiUri',
  'urls',
  'kanmiiUnderscore',
  'formatDate',
  '$timeout',
  '$q',
  'FormM'
]
function BidRequestController(LcBidRequest, $scope, $http, kanmiiUri, urls, kanmiiUnderscore, formatDate, $timeout, $q,
  FormM) {
  var vm = this;

  initialize()
  function initialize() {
    vm.newBid = null

    /**
     * When the search-bid directive returns, the result is propagated into this model
     * @type {null|object}
     */
    vm.searchedBidResult = null

    vm.selectedBids = {}

    vm.selectedDownloadedBids = {}

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
  }

  /**
   * When a row of the pending bids table is clicked, this function is invoked with the bid at that row
   * @param {{}} bid - the bid object at the row that was double clicked
   */
  vm.rowDblClickCb = function rowDblClickCb(bid) {
    FormM.getPaginated({number: bid.form_m_number}).$promise.then(function(data) {
      var results = data.results
      if (results.length && results.length === 1) {
        $scope.goToFormM(results[0])
      }
    })
  }

  /**
   * The table caption for the 'model-table' directive
   * @type {string}
   */
  vm.tableCaption = 'Pending Bids'

  /**
   * Will be invoked when any of the pager links is clicked in other to get the bids at the pager url
   * @type {getBidsOnNavigation}
   */
  vm.getBidsOnNavigation = getBidsOnNavigation
  function getBidsOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      updateBids(response.data)
    })
  }

  $scope.$watch(function searchedBidResult() {return vm.searchedBidResult},
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
    vm.bidRequests = data.results

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
    var editedBids = []

    kanmiiUnderscore.each(vm.selectedDownloadedBids, function(checked, bidId) {
      if (!checked) return

      var bid = getBidFromId(bidId)
      if (bid) {
        bid.requested_at = formatDate(new Date())
        //LcBidRequest.put(bid).$promise.then(bidEditSuccess, bidEditFailure)
        editedBids.push(LcBidRequest.put(bid).$promise)
      }
    })

    if (editedBids.length) {
      $q.all(editedBids).then(function() {
        initialize()
      })
    }
  }

  vm.refreshPage = function refreshPage() {
    $timeout(function() {initialize()}, 3000)
  }

  function getBidFromId(bidId) {
    for (var index = 0; index < vm.bidRequests.length; index++) {
      var bid = vm.bidRequests[index]
      if (bid.id === +bidId) return bid
    }

    return null
  }
}

require('./display-pending-bid/display-pending-bid.js')
