"use strict";

/*jshint camelcase:false*/

var app = angular.module('edit-bid', ['angularModalService'])

app.factory('EditBid', EditBid)
EditBid.$inject = ['ModalService']
function EditBid(ModalService) {
  function EditBidService() {
    var self = this

    self.editWithModal = editWithModal
    function editWithModal(config) {
      config = (config && angular.isObject(config)) ? config : {}
      var bid = config.bid

      if (!bid) throw new Error('You did not specify the bid to edit')

      var formM = config.formM

      ModalService.showModal({
        controller: 'EditBidModalCtrl as editBidModal',
        template: require('./edit-bid-modal.html'),
        inputs: {
          bid: bid,
          formM: formM
        }
      }).then(function(modal) {
        modal.element.dialog({
          minWidth: 450,
          minHeight: 400,
          modal: true,
          title: config.title || 'Edit Bid for ' + bid.form_m_number,
          close: function() {
            modal.close.then()
            config.closeCb ? config.closeCb(bid) : angular.noop
          }
        })

        modal.close.then(function(bidForEdit) {
          if (bidForEdit) {
            console.log('bidForEdit = ', bidForEdit);
            config.closeCb ? config.closeCb() : angular.noop //jshint -W030
          }
        })
      })
    }
  }

  return new EditBidService()
}

app.controller('EditBidModalCtrl', EditBidModalCtrl)
EditBidModalCtrl.$inject = ['bid', 'formM', '$filter']
function EditBidModalCtrl(bid, formM, filter) {
  var vm = this

  vm.resetForm = function resetForm(form) {
    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }

    vm.formIsEditable = {
      goods: false, amount: false, controls: false
    }
    vm.bid = angular.copy(bid)
    vm.formM = angular.copy(formM)
  }
  vm.resetForm()

  vm.bidAmountGetterSetter = function bidAmountGetterSetter(newVal) {
    if (newVal) vm.bid.amount = Number(newVal.replace(',', ''))
    else if (vm.bid.amount) return filter('number')(vm.bid.amount, 2)
    else return ''
  }

  vm.toggleEnableEditForm = toggleEnableEditForm
  function toggleEnableEditForm(inputName) {
    vm.formIsEditable[inputName] = !vm.formIsEditable[inputName]
    vm.formIsEditable.controls = vm.formIsEditable.amount || vm.formIsEditable.goods
  }
}
