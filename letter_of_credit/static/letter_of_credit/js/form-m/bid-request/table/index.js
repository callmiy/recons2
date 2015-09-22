"use strict";

var app = angular.module('form-m-bid-request-display', [])

app.directive('bidRequestDisplay', bidRequestDisplayDirective)
function bidRequestDisplayDirective() {

  function link(scope, element, attributes, self) {}

  return {
    restrict: 'E',
    link: link,
    scope: {},
    bindToController: {
      bidRequests: '=',
      newBid: '='
    },
    controller: 'BidRequestDisplayDirectiveCtrl as bidTable',
    template: require('./table.html')
  }
}

app.controller('BidRequestDisplayDirectiveCtrl', BidRequestDisplayDirectiveCtrl)
BidRequestDisplayDirectiveCtrl.$inject = []
function BidRequestDisplayDirectiveCtrl() {

}
