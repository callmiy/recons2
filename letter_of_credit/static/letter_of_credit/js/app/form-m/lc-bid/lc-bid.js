"use strict";

var rootCommons = require('commons')

var app = angular.module('lc-bid', [
  'rootApp'
])

app.directive('lcBid', lcBidDirective)

lcBidDirective.$inject = []

function lcBidDirective() {
  return {
    restrict: 'A',
    templateUrl: require('lcAppCommons').buildUrl('form-m/lc-bid/lc-bid.html'),
    scope: true,
    bindToController: {
      formM: '=mfContext',
      bid: '=',
      onBidChanged: '&'
    },
    controller: 'LcBidDirectiveController as lcBid'
  }
}

app.controller('LcBidDirectiveController', LcBidDirectiveController)

LcBidDirectiveController.$inject = ['$scope', '$filter', 'formFieldIsValid']

function LcBidDirectiveController($scope, $filter, formFieldIsValid) {
  var vm = this
  var title = 'Make Bid Request'
  init()

  function init(form) {
    vm.title = title
    vm.showBidForm = false
    vm.bid = {}

    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  vm.isValid = function(name, validity) {
    return formFieldIsValid($scope, 'bidForm', name, validity)
  }

  vm.amountGetterSetter = function(val) {
    if (arguments.length) {
      if (!/[\d,\.]+/.test(val)) vm.cover.amount = null
      else vm.cover.amount = Number(val.replace(/,/g, ''))
    } else return vm.cover.amount ? $filter('number')(vm.cover.amount, 2) : undefined
  }

  vm.toggleShow = function toggleShow(form) {
    vm.showBidForm = vm.formM.amount && vm.formM.number && !vm.showBidForm

    if (!vm.showBidForm) {
      init(form)
    }
    else {
      vm.title = 'Dismiss'
      vm.bid.amount = vm.formM.amount
      vm.bid.goods_description = vm.formM.goods_description
    }
  }

  $scope.$watch(function getFormM() {return vm.formM}, function(newFormM) {
    if (newFormM) {
      var number = newFormM.number
      var amount = newFormM.amount

      if (!number || !amount) init()
    }
  }, true)

  $scope.$watch(function getBid() {return vm.bid}, function(newBid) {
    if (newBid) vm.onBidChanged({bid: newBid, bidForm: $scope.bidForm})

  }, true)
}
