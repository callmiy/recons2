"use strict";

var app = angular.module('form-m-bid-request-display', ['toggle-bg-color'])

app.config(require('commons').interpolateProviderConfig)

app.directive('bidRequestDisplay', bidRequestDisplayDirective)
function bidRequestDisplayDirective() {

  function link(scope, element, attributes, self) {}

  return {
    restrict: 'E',
    link: link,
    scope: {},
    bindToController: {
      bidCollection: '=',
      newBid: '='
    },
    controller: 'BidRequestDisplayDirectiveCtrl as formMBidTable',
    templateUrl: require('formMCommons').buildUrl('bid-request/table/table.html')
  }
}

app.controller('BidRequestDisplayDirectiveCtrl', BidRequestDisplayDirectiveCtrl)
BidRequestDisplayDirectiveCtrl.$inject = ['$scope']
function BidRequestDisplayDirectiveCtrl(scope) {
  var vm = this

  vm.paginationSize = 20
  vm.orderProp = '-created_at'

  function setUpLinks() {}

  scope.$watch(function getNewFormM() {return vm.newBid}, function(newBid) {
    if (newBid) {
      vm.bidCollection.results.unshift(newBid)
      vm.orderProp = '-id'
    }
  })

  scope.$watch(function() {return vm.bidCollection}, function(newBids) {
    if (newBids) {
      if (newBids.$promise) {
        newBids.$promise.then(function(data) {
          setUpLinks(data.next, data.previous, data.count)
        })

      } else {
        setUpLinks(newBids.next, newBids.previous, newBids.count)
      }
    }
  })
}
