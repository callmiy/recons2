"use strict";
/*jshint camelcase:false*/

var app = angular.module('add-bid', ['rootApp', 'kanmii-underscore', 'form-m-search-service'])

app.directive('addBid', addBidDirective)
addBidDirective.$inject = ['ModalService']
function addBidDirective(ModalService) {
  function link(scope, elm, attributes, self) {
    elm
      .css({cursor: 'pointer'})
      .bind('click', function() {
              ModalService.showModal({
                templateUrl: require('formMCommons').buildUrl('bid-request/add-bid/add-bid.html'),

                controller: 'AddBidModalCtrl as addBidModal'

              }).then(function(modal) {
                modal.element.dialog({
                  dialogClass: 'no-close',
                  modal: true,
                  minWidth: 600,
                  maxHeight: 450,
                  title: 'Make Bid Request'
                })

                modal.close.then(function(submittedData) {
                  if (submittedData) {
                    self.saveBid(submittedData)
                  }
                })
              })
            })
  }

  return {
    restrict: 'A',
    link: link,
    controller: 'AddBidDirectiveCtrl as addBid',
    scope: {},
    bindToController: {
      onNewBid: '&'
    }
  }
}

app.controller('AddBidDirectiveCtrl', AddBidDirectiveCtrl)
AddBidDirectiveCtrl.$inject = [
  'xhrErrorDisplay', 'LcBidRequest'
]
function AddBidDirectiveCtrl(xhrErrorDisplay, LcBidRequest) {
  var vm = this

  vm.saveBid = saveBid
  function saveBid(submittedData) {
    var dataToSave = {
      amount: submittedData.amount,
      mf: submittedData.mf.url
    }

    new LcBidRequest(dataToSave).$save(bidSavedSuccess, bidSavedError)

    function bidSavedSuccess(data) {
      vm.onNewBid({newBid: data})
    }

    function bidSavedError(xhr) {
      xhrErrorDisplay(xhr, {mf: 'form m', amount: 'amount'})
    }
  }
}

app.controller('AddBidModalCtrl', AddBidModalCtrl)
AddBidModalCtrl.$inject = [
  'resetForm',
  '$element',
  'close',
  'SearchFormMService',
  'kanmiiUnderscore'
]
function AddBidModalCtrl(resetForm, element, close, SearchFormMService, kanmiiUnderscore) {

  var vm = this

  initForm()
  function initForm() {
    vm.bid = {
      mf: {}
    }
  }

  vm.mfGetterSetter = function mfGetterSetter(newVal) {
    if (angular.isDefined(newVal)) vm.bid.mf = newVal
    else if (!kanmiiUnderscore.isEmpty(vm.bid.mf)) return vm.bid.mf.number + ': ' + vm.bid.mf.applicant_data.name
    else return ''
  }

  vm.close = close

  vm.reset = function reset(form) {
    resetForm(form, element, '.form-control', initForm)
  }

  vm.submitBid = submitBid
  function submitBid(newBid) {
    close(newBid)
  }

  function executeAfterDim() {
    element.find('.form-control').each(function() {
      var $el = $(this)
      $el.prop('disabled', !$el.prop('disabled'))
    })
  }

  vm.getFormM = function() {
    SearchFormMService.searchWithModal({
      parent: element,
      dim: true,
      dimCb: executeAfterDim,
      unDimCb: executeAfterDim
    }).then(function(data) {
      var results = data.results
      if (results.length) {
        if (results.length === 1) vm.mfGetterSetter(results[0])
      }
    })
  }
}
