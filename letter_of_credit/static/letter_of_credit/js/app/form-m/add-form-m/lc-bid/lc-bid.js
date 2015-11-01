"use strict";

/*jshint camelcase:false*/

var app = angular.module('add-form-m')

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

LcBidDirectiveController.$inject = [
  '$scope',
  '$filter',
  'formFieldIsValid',
  'kanmiiUnderscore',
  'LcBidRequest',
  'xhrErrorDisplay',
  'confirmationDialog'
]

function LcBidDirectiveController($scope, $filter, formFieldIsValid, kanmiiUnderscore, LcBidRequest, xhrErrorDisplay,
  confirmationDialog) {
  var vm = this
  var title = 'Make Bid Request'
  init()

  function init(form) {
    vm.title = title
    $scope.addFormMState.showBidForm = false
    $scope.addFormMState.bid = {}

    $scope.addFormMState.showEditBid = false
    vm.bidToEdit = null

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
    $scope.addFormMState.showBidForm = $scope.addFormMState.formM.amount && $scope.addFormMState.formM.number && !$scope.addFormMState.showBidForm

    if (!$scope.addFormMState.showBidForm) {
      init(form)
    }
    else {
      vm.title = 'Dismiss'
      $scope.addFormMState.bid.goods_description = $scope.addFormMState.formM.goods_description

      $scope.addFormMState.bid.amount = !$scope.addFormMState.existingBids.length ?
                                        $scope.addFormMState.formM.amount : null
    }
  }

  vm.editBidInvalid = function editBidInvalid() {
    if (kanmiiUnderscore.isEmpty(vm.bidToEdit)) return true

    if ($scope.bidForm.$invalid) return true

    return kanmiiUnderscore.all(bidNotModified())
  }

  vm.onBidDblClick = function onBidDblClick(bid, $index) {
    $scope.addFormMState.showEditBid = true
    $scope.addFormMState.showBidForm = false
    vm.toggleShow()
    vm.bidToEdit = angular.copy(bid)
    vm.bidToEdit.amount = Number(vm.bidToEdit.amount)
    vm.bidToEdit.$index = $index
    $scope.addFormMState.bid.amount = vm.bidToEdit.amount
  }

  function makeDialogConfig() {
    var ccy = $scope.addFormMState.formM.currency.code
    var text = 'Edit Bid' +
               '\n\nForm M:           ' + vm.bidToEdit.form_m_number +
               '\nBid Amount' +
               '\n  before edit:    ' + ccy + $filter('number')(vm.bidToEdit.amount, 2) +
               '\n  after edit:     ' + ccy + $filter('number')($scope.addFormMState.bid.amount, 2) +
               '\nGoods description' +
               '\n  before edit:    ' + vm.bidToEdit.goods_description +
               '\n\n  after edit:     ' + $scope.addFormMState.bid.goods_description

    var title = 'Edit bid "' + vm.bidToEdit.form_m_number + '"'

    return {
      title: title, text: text
    }
  }

  vm.editBid = function editBid() {

    confirmationDialog.showDialog(makeDialogConfig()).then(function(answer) {
      if (answer) doEdit()
    })

    function doEdit() {
      var bid = angular.copy(vm.bidToEdit)
      bid.amount = $scope.addFormMState.bid.amount
      bid.goods_description = $scope.addFormMState.bid.goods_description

      //we need to do this so this bid can show up at the bid list interface in case user wishes to download and
      //send the bid to treasury
      bid.requested_at = null

      LcBidRequest.put(bid).$promise.then(function() {
        $scope.addFormMState.existingBids.splice(bid.$index, 1, bid)
        init()
      }, function(xhr) {
        xhrErrorDisplay(xhr)
      })
    }
  }

  function bidNotModified() {
    return {
      amount: vm.bidToEdit.amount === $scope.addFormMState.bid.amount,
      goods_description: vm.bidToEdit.goods_description === $scope.addFormMState.bid.goods_description
    }
  }
}
