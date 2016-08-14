"use strict";

/*jshint camelcase:false*/

var underscore = require( 'underscore' )

function init(vm, initialDealProps) {
  vm.deal = {
    deal_number: null,
    currency: initialDealProps.currency ? initialDealProps.currency : null,
    amount_allocated: initialDealProps.amount_allocated ? initialDealProps.amount_allocated : null,
    allocated_on: new Date(),
    amount_utilized: initialDealProps.amount_utilized ? initialDealProps.amount_utilized : null,
    utilized_on: new Date(),
    content_type: initialDealProps.content_type,
    object_id: initialDealProps.object_id
  }

  vm.currDeal = initialDealProps

  vm.datePickerIsOpenFor = {
    dealDate: false,
    dealDateUtilized: false
  }
}

/**
 * We will watch some states of this directive, and when they change, we store them in our app store so that they
 * can be restored later when user navigates away and comes back to our this directive/router state
 * @param vm
 * @param addDealStore
 */
function storeState(vm, addDealStore) {
  addDealStore.dealStore = {
    deal: vm.deal,
    currDeal: vm.currDeal
  }
}

/**
 *
 * @param addDealStore
 * @param vm
 * @param initialDealProps
 */
function setState(addDealStore, vm, initialDealProps) {
  var dealStore = addDealStore.dealStore

  if ( underscore.isEmpty( dealStore ) || !underscore.isEqual( initialDealProps, dealStore.currDeal ) ) {
    addDealStore.dealStore = null // for cases where !underscore.isEqual( initialDealProps, dealStore.currDeal )
    return
  }

  vm.deal = dealStore.deal
  addDealStore.dealStore = null
}

module.exports = {
  setState: setState,
  storeState: storeState,
  init: init
}
