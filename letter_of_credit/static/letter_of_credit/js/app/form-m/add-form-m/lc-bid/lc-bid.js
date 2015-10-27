"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-bid', [
  'rootApp'
])

app.directive('lcBid', lcBidDirective)

lcBidDirective.$inject = []

function lcBidDirective() {
  return {
    restrict: 'A',
    templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m/lc-bid/lc-bid.html'),
    scope: false,
    bindToController: {
      bid: '='
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
    vm.show = false
    $scope.addFormMState.bid = {}

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
      if (!/[\d,\.]+/.test(val)) $scope.addFormMState.bid.amount = null
      else $scope.addFormMState.bid.amount = Number(val.replace(/,/g, ''))

    } else return $scope.addFormMState.bid.amount ? $filter('number')($scope.addFormMState.bid.amount, 2) : undefined
  }

  vm.toggleShow = function toggleShow(form) {
    vm.show = $scope.addFormMState.formM.amount && $scope.addFormMState.formM.number && !vm.show

    if (!vm.show) {
      init(form)
    }
    else {
      vm.title = 'Dismiss'
      $scope.addFormMState.bid.amount = $scope.addFormMState.formM.amount
      $scope.addFormMState.bid.goods_description = $scope.addFormMState.formM.goods_description
    }
  }
}
