"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'allocation-download-bids', [
  'rootApp',
  'consolidated-lc-bid-request',
  'lc-service',
  'treasury-allocation-service'
] )

app.directive( 'allocationDownloadBids', allocationDownloadBidsDirective )

allocationDownloadBidsDirective.$inject = []

function allocationDownloadBidsDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' )
      .buildUrl( 'letter-of-credit', 'form-m/treasury-allocation/download-bids/download-bids.html' ),
    scope: false,
    controller: 'AllocationDownloadBidsDirectiveController as downloadBids'
  }
}

app.controller( 'AllocationDownloadBidsDirectiveController', AllocationDownloadBidsDirectiveController )

AllocationDownloadBidsDirectiveController.$inject = [
  '$window',
  'urls'
]

function AllocationDownloadBidsDirectiveController($window, urls) {
  var vm = this  // jshint -W040

  vm.downloadOutstandingBids = function downloadOutstandingBids() {
    $window.location.href = urls.consolidatedLcBidRequestDownloadUrl
  }
}
