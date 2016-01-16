"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-bid', [])

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
  'resetForm2',
  'moment',
  'toISODate'
]

function LcBidDirectiveController($scope, $filter, formFieldIsValid, kanmiiUnderscore, LcBidRequest, xhrErrorDisplay,
  confirmationDialog, formMObject, resetForm2, moment, toISODate) {
  var vm = this
  vm.formM = formMObject
  var title = 'New Bid Request'

  init()
  function init(form) {
    vm.datePickerIsOpen = {
      bidRequestedDate: false,
      bidCreatedDate: false,
      bidMaturityDate: false
    }
    vm.title = title
    vm.formM.showBidForm = false
    vm.formM.showEditBid = false
    vm.bidToEdit = null
    formMObject.bid = {}

    if (form) {
      var bidFormCtrlNames = ['bidMaturityDate', 'bidAmount', 'bidGoodsDescription']
      resetForm2(form, [{form: form, elements: bidFormCtrlNames}])
    }
  }

  vm.openDatePicker = function openDatePicker(prop) {
    kanmiiUnderscore.each(vm.datePickerIsOpen, function (val, key) {
      vm.datePickerIsOpen[key] = prop === key
    })
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

  function copyBidForEdit() {
    vm.bidToEdit.amount = Number(vm.bidToEdit.amount)
    vm.formM.bid.amount = vm.bidToEdit.amount
    vm.formM.bid.downloaded = vm.bidToEdit.downloaded
    vm.bidToEdit.created_at = new Date(vm.bidToEdit.created_at)
    vm.formM.bid.created_at = vm.bidToEdit.created_at
    vm.bidToEdit.requested_at = vm.bidToEdit.requested_at ? new Date(vm.bidToEdit.requested_at) : null
    vm.formM.bid.requested_at = vm.bidToEdit.requested_at
    vm.bidToEdit.maturity = vm.bidToEdit.maturity ? new Date(vm.bidToEdit.maturity) : null
    vm.formM.bid.maturity = vm.bidToEdit.maturity
  }

  function toHumanDate(dtObj) {
    return dtObj ? moment(dtObj).format('DD-MMM-YYYY') : null
  }

  vm.onEditBid = function onEditBid(bid, $index, form) {
    form.$setPristine()
    vm.formM.showEditBid = true
    vm.formM.showBidForm = false
    vm.toggleShow()
    vm.bidToEdit = angular.copy(bid)
    vm.bidToEdit.$index = $index
    copyBidForEdit()
  }

  vm.trashBid = function trashBid(bid, $index) {
    if (formMObject.showBidForm || formMObject.showEditBid) return

    var text = '\n\nApplicant:  ' + bid.applicant +
      '\nForm M:     ' + bid.form_m_number +
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

  function createEditBidMessage(bidIsNotModified) {
    var text = '\n\nForm M:           ' + vm.bidToEdit.form_m_number
    var ccy = formMObject.currency.code

    if (!bidIsNotModified.amount) {
      text += '\nBid Amount' +
        '\n  before edit:    ' + ccy + $filter('number')(vm.bidToEdit.amount, 2) +
        '\n  after edit:     ' + ccy + $filter('number')(formMObject.bid.amount, 2)
    }

    if (!bidIsNotModified.goods_description) {
      text += '\nGoods description' +
        '\n  before edit:    ' + vm.bidToEdit.goods_description +
        '\n  after edit:     ' + formMObject.bid.goods_description
    }

    if (!bidIsNotModified.maturity) {
      text += '\nMaturity' +
        '\n  before edit:    ' + toHumanDate(vm.bidToEdit.maturity) +
        '\n  after edit:     ' + toHumanDate(formMObject.bid.maturity)
    }

    if (!bidIsNotModified.created_at) {
      text += '\nDate created' +
        '\n  before edit:    ' + toHumanDate(vm.bidToEdit.created_at) +
        '\n  after edit:     ' + toHumanDate(formMObject.bid.created_at)
    }

    if (!bidIsNotModified.requested_at) {
      text += '\nDate requested' +
        '\n  before edit:    ' + toHumanDate(vm.bidToEdit.requested_at) +
        '\n  after edit:     ' + toHumanDate(formMObject.bid.requested_at)
    }

    if (!bidIsNotModified.downloaded) {
      text += '\nDownloaded' +
        '\n  before edit:    ' + vm.bidToEdit.downloaded +
        '\n  after edit:     ' + vm.formM.bid.downloaded
    }

    return text
  }

  vm.editBid = function editBid() {
    var title = 'Edit bid "' + vm.bidToEdit.form_m_number + '"'
    var bidIsNotModified = bidNotModified()
    var text = createEditBidMessage(bidIsNotModified)


    confirmationDialog.showDialog({
      title: title,
      text: 'Are you sure you want to edit Bid:' + text
    }).then(function (answer) {
      if (answer) doEdit()
      else copyBidForEdit()
    })

    function doEdit() {
      var bid = angular.copy(vm.bidToEdit)

      if (!bidIsNotModified.goods_description) {
        bid.update_goods_description = true
        formMObject.goods_description = formMObject.bid.goods_description
      }

      kanmiiUnderscore.each(formMObject.bid, function (val, key) {
        if (key === 'created_at' || key === 'requested_at' || key === 'maturity') val = toISODate(val)
        bid[key] = val
      })

      LcBidRequest.put(bid).$promise.then(function () {
        confirmationDialog.showDialog({title: title, text: 'Edit successful: ' + text, infoOnly: true})
        init()
        formMObject.setBids()

      }, function (xhr) {
        xhrErrorDisplay(xhr)
      })
    }
  }

  function bidNotModified() {
    return {
      amount: vm.bidToEdit.amount === formMObject.bid.amount,
      goods_description: vm.bidToEdit.goods_description === formMObject.bid.goods_description,
      downloaded: vm.bidToEdit.downloaded === formMObject.bid.downloaded,
      created_at: angular.equals(vm.bidToEdit.created_at, formMObject.bid.created_at),
      requested_at: angular.equals(vm.bidToEdit.requested_at, formMObject.bid.requested_at),
      maturity: angular.equals(vm.bidToEdit.maturity, formMObject.bid.maturity)
    }
  }

  $scope.$watch(function () {return formMObject}, function onFormMObjectChanged(formM) {
    formMObject.bidForm = $scope.bidForm

    if (formM) {
      if (!formM.amount || !formM.number) init(formMObject.bidForm)
    }
  }, true)
}
