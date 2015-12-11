"use strict";

/*jshint camelcase:false*/

var app = angular.module('add-form-m')

app.directive('lcBid', lcBidDirective)

lcBidDirective.$inject = []

function lcBidDirective() {
  return {
    restrict: 'A',
    templateUrl: require('lcAppCommons').buildUrl('form-m/add-form-m/lc-bid/lc-bid.html'),
    scope: true,
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
  'confirmationDialog',
  'formMObject',
  'resetForm2'
]

function LcBidDirectiveController($scope, $filter, formFieldIsValid, kanmiiUnderscore, LcBidRequest, xhrErrorDisplay,
  confirmationDialog, formMObject, resetForm2) {
  var vm = this
  vm.formM = formMObject
  var title = 'Make Bid Request'
  init()

  function init(form) {
    vm.title = title
    vm.formM.showBidForm = false
    vm.formM.showEditBid = false
    vm.bidToEdit = null
    formMObject.bid = {}

    if (form) resetForm2(form)
  }

  vm.isValid = function (name, validity) {
    return formFieldIsValid($scope, 'bidForm', name, validity)
  }

  vm.amountGetterSetter = function (val) {
    if (arguments.length) {
      if (!/[\d,\.]+/.test(val)) vm.formM.bid.amount = null
      else vm.formM.bid.amount = Number(val.replace(/,/g, ''))

    } else return vm.formM.bid.amount ? $filter('number')(vm.formM.bid.amount, 2) : null
  }

  vm.toggleShow = function toggleShow(form) {
    vm.formM.showBidForm = vm.formM.amount && vm.formM.number && !vm.formM.showBidForm

    if (!vm.formM.showBidForm) init(form)
    else {
      vm.title = 'Dismiss'
      formMObject.bid.goods_description = formMObject.goods_description
      vm.formM.bid.amount = !vm.formM.existingBids.length ? formMObject.amount : null
    }
  }

  vm.editBidInvalid = function editBidInvalid(form) {
    if (kanmiiUnderscore.isEmpty(vm.bidToEdit)) return true

    if (form.$invalid) return true

    return kanmiiUnderscore.all(bidNotModified())
  }

  vm.onBidDblClick = function onBidDblClick(bid, $index) {
    vm.formM.showEditBid = true
    vm.formM.showBidForm = false
    vm.toggleShow()
    vm.bidToEdit = angular.copy(bid)
    vm.bidToEdit.amount = Number(vm.bidToEdit.amount)
    vm.bidToEdit.$index = $index
    vm.formM.bid.amount = vm.bidToEdit.amount
  }

  vm.trashBid = function trashBid(bid, $index) {
    var text = '\n\nApplicant: ' + bid.applicant +
      '\nForm M: ' + bid.form_m_number +
      '\nBid Amount: ' + bid.currency + ' ' + $filter('number')(bid.amount, 2)

    var mf = '"' + bid.form_m_number + '"'

    confirmationDialog.showDialog({
      text: 'Sure you want to delete bid:' + text, title: 'Delete bid for ' + mf
    }).then(function (answer) {
      if (answer) {
        LcBidRequest.delete(bid).$promise.then(bidDeleteSuccess, function bidDeleteFailure(xhr) {
          xhrErrorDisplay(xhr)
        })
      }
    })

    function bidDeleteSuccess() {
      confirmationDialog.showDialog({
        text: 'Bid delete successfully:' + text,
        title: 'Bid for ' + mf + ' deleted successfully',
        infoOnly: true
      })

      vm.formM.existingBids.splice($index, 1)
    }
  }

  vm.editBid = function editBid() {
    var title = 'Edit bid "' + vm.bidToEdit.form_m_number + '"'

    var ccy = formMObject.currency.code
    var text = '\n\nForm M:           ' + vm.bidToEdit.form_m_number +
      '\nBid Amount' +
      '\n  before edit:    ' + ccy + $filter('number')(vm.bidToEdit.amount, 2) +
      '\n  after edit:     ' + ccy + $filter('number')(vm.formM.bid.amount, 2) +
      '\nGoods description' +
      '\n  before edit:    ' + vm.bidToEdit.goods_description +
      '\n\n  after edit:     ' + vm.formM.bid.goods_description

    confirmationDialog.showDialog({
      title: title,
      text: 'Are you sure you want to edit Bid:' + text
    }).then(function (answer) {
      if (answer) doEdit()
    })

    function doEdit() {
      var bid = angular.copy(vm.bidToEdit)
      bid.amount = vm.formM.bid.amount
      bid.goods_description = formMObject.bid.goods_description

      //we need to do this so this bid can show up at the bid list interface in case user wishes to download and
      //send the bid to treasury
      bid.requested_at = null

      LcBidRequest.put(bid).$promise.then(function () {
        confirmationDialog.showDialog({title: title, text: 'Edit successful: ' + text, infoOnly: true})
        vm.formM.existingBids.splice(bid.$index, 1, bid)
        init()
      }, function (xhr) {
        xhrErrorDisplay(xhr)
      })
    }
  }

  function bidNotModified() {
    return {
      amount: vm.bidToEdit.amount === formMObject.bid.amount,
      goods_description: vm.bidToEdit.goods_description === formMObject.bid.goods_description
    }
  }

  $scope.$watch(function () {return formMObject}, function onFormMObjectChanged(formM) {
    formMObject.bidForm = $scope.bidForm

    if(formM){
      if (!formM.amount || !formM.number) {
        init(formMObject.bidForm)
      }
    }
  }, true)
}
