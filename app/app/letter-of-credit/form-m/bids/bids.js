"use strict";

/*jshint camelcase:false*/

require( './search-bids/search-bids.js' )

var app = angular.module( 'form-m-bids', [
  'ui.router',
  'lc-bid-request',
  'rootApp',
  'kanmii-URI',
  'search-bids'
] )

app.config( bidURLConfig )
bidURLConfig.$inject = [ '$stateProvider' ]
function bidURLConfig($stateProvider) {

  $stateProvider
    .state( 'form_m.bids', {

      kanmiiTitle: 'Bids',

      views: {
        bids: {
          template: require( './bids.html' ),

          controller: 'BidRequestController as bidHome'
        }
      }
    } )
}

app.controller( 'BidRequestController', BidRequestController )
BidRequestController.$inject = [
  'LcBidRequest',
  '$scope',
  '$http',
  'kanmiiUri',
  'urls',
  'underscore',
  'formatDate',
  '$timeout',
  '$q'
]
function BidRequestController(LcBidRequest, $scope, $http, kanmiiUri, urls, underscore, formatDate, $timeout, $q) {
  var vm = this;

  initialize()
  function initialize() {
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

    if ( !arguments.length ) {
      LcBidRequest.pending().$promise.then( function (data) {
        updateBids( data )
      } )
    }
  }

  /**
   * When a row of the pending bids table is clicked, this function is invoked with the bid at that row
   * @param {{}} bid - the bid object at the row that was double clicked
   */
  vm.rowDblClickCb = function rowDblClickCb(bid) {
    $scope.goToFormM( bid.form_m_number )
  }

  /**
   * Will be invoked when any of the pager links is clicked in other to get the bids at the pager url
   * @type {getBidsOnNavigation}
   */
  vm.getBidsOnNavigation = getBidsOnNavigation
  function getBidsOnNavigation(linkUrl) {
    $http.get( linkUrl ).then( function (response) {
      updateBids( response.data )
    } )
  }

  vm.onBidsSearched = function onBidsSearched(result) {
    initialize( false )
    updateBids( result )
  }

  $scope.$watch( function searchedBidResult() {
      return vm.searchedBidResult
    },
    function searchedBidResultChanged(searchedBidResult) {
      if ( searchedBidResult ) {
        updateBids( searchedBidResult )
      }
    } )

  /**
   * Update the bid collection and pagination hooks
   * @param {object} data
   */
  function updateBids(data) {
    vm.bidRequests = data.results
    vm.paginationHooks = { next: data.next, previous: data.previous, count: data.count }
  }

  var url = kanmiiUri( urls.lcBidRequestDownloadUrl )

  vm.downloadUrl = function downloadUrl() {
    if ( !underscore.isEmpty( vm.selectedBids ) ) {
      var search = []

      underscore.each( vm.selectedBids, function (selection, bidId) {
        if ( selection === true ) search.push( bidId )
      } )

      return search.length ? url.search( { bid_ids: search } ).toString() : null
    }

    return null
  }

  vm.downloadBtnDisabled = function downloadBtnDisabled() {
    if ( underscore.isEmpty( vm.selectedBids ) ) return true

    return !underscore.any( vm.selectedBids, function (selectionVal) {
      return selectionVal === true
    } )
  }

  vm.onSelectedBidsChanged = onSelectedBidsChanged
  function onSelectedBidsChanged(newSelections) {
    if ( newSelections && !underscore.isEmpty( newSelections ) ) {
      underscore.each( newSelections, function (checked, bidId) {
        var bid = getBidFromId( bidId )

        if ( bid && bid.downloaded ) vm.selectedDownloadedBids[ bidId ] = checked
      } )
    }
  }

  vm.markRequestedBtnDisabled = function markRequestedBtnDisabled() {
    if ( underscore.isEmpty( vm.selectedDownloadedBids ) ) return true

    for ( var bidId in vm.selectedBids ) {
      if ( !(bidId in vm.selectedDownloadedBids) && vm.selectedBids[ bidId ] ) return true
    }

    return !underscore.any( vm.selectedDownloadedBids, function (checked) {
      return checked === true
    } )
  }

  vm.markRequested = function markRequested() {
    var editedBids = []

    underscore.each( vm.selectedDownloadedBids, function (checked, bidId) {
      if ( !checked ) return

      var bid = getBidFromId( bidId )
      if ( bid ) {
        bid.requested_at = formatDate( new Date() )
        editedBids.push( LcBidRequest.put( bid ).$promise )
      }
    } )

    if ( editedBids.length ) {
      $q.all( editedBids ).then( function () {
        initialize()
      } )
    }
  }

  vm.refreshPage = function refreshPage() {
    if ( !vm.downloadBtnDisabled() ) {
      $timeout( function () {
        initialize()
      }, 3000 )
    }
  }

  function getBidFromId(bidId) {
    for ( var index = 0; index < vm.bidRequests.length; index++ ) {
      var bid = vm.bidRequests[ index ]
      if ( bid.id === +bidId ) return bid
    }

    return null
  }
}

require( './display-pending-bid/display-pending-bid.js' )
