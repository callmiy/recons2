"use strict";

var underscore = require( 'underscore' )

function init(vm, title) {
  vm.datePickerIsOpen = {
    bidRequestedDate: false,
    bidCreatedDate: false
  }
  vm.title = title
  vm.showBidForm = false
  vm.formM.showEditBid = false
  vm.bidToEdit = null
  vm.bid = {}
  vm.showAllocateFx = false
  vm.selectedBids = {}
  vm.initialBidProps = null
  vm.allocationTitle = null
}

/**
 * We will watch some states of this directive, and when they change, we store them in our app store so that they
 * can be restored later when user navigates away and comes back to our this directive/router state
 * @param vm
 * @param formMAppStore
 */
function storeState(vm, formMAppStore) {
  formMAppStore.lcBid = {
    title: vm.title,
    showBidForm: vm.showBidForm,
    showEditBid: vm.formM.showEditBid,
    bidToEdit: vm.bidToEdit,
    bid: vm.bid,
    showAllocateFx: vm.showAllocateFx,
    selectedBids: vm.selectedBids,
    mf: vm.formM.number,
    initialBidProps: vm.initialBidProps,
    allocationTitle: vm.allocationTitle
  }
}

/**
 *
 * @param formMAppStore
 * @param vm
 */
function setState(formMAppStore, vm) {
  var lcBid = formMAppStore.lcBid

  if ( underscore.isEmpty( lcBid ) || (lcBid.mf !== vm.formM.number) || !vm.formM._id ) return

  vm.title = lcBid.title
  vm.showBidForm = lcBid.showBidForm
  vm.formM.showEditBid = lcBid.showEditBid
  vm.bidToEdit = lcBid.bidToEdit
  vm.bid = lcBid.bid
  vm.showAllocateFx = lcBid.showAllocateFx
  vm.selectedBids = lcBid.selectedBids
  vm.initialBidProps = lcBid.initialBidProps
  vm.allocationTitle = lcBid.allocationTitle
  formMAppStore.lcBid = null
}

module.exports = {
  setState: setState,
  storeState: storeState,
  init: init
}
