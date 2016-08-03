"use strict";

var underscore = require( 'underscore' )

function getParams(vm) {
  return function getSearchAllocationParams() {
    return {
      isAllocationSearchOpen: vm.isAllocationSearchOpen,
      search: vm.search,
      allocationList: vm.allocationList,
      showSearchResult: vm.showSearchResult
    }
  }
}

/**
 * We will watch some states of this directive, and when they change, we store than into our app store so that they
 * can be restored later when user navigates away and comes back to our this directive/router state
 * @param vm
 * @param oldFilter
 * @param formMAppStore
 */
function onParamsChanged(vm, formMAppStore) {

  return function storeSearchAllocationParams() {
    formMAppStore.treasuryAllocation.searchAllocationParams = {
      isAllocationSearchOpen: vm.isAllocationSearchOpen,
      search: vm.search,
      allocationList: vm.allocationList,
      showSearchResult: vm.showSearchResult
    }
  }
}

/**
 *
 * @param stateParams
 * @param vm
 * @param oldFilter
 * @param NgTableParams
 */
function setState(stateParams, vm) {
  if ( underscore.isEmpty( stateParams ) ) {
    vm.isAllocationSearchOpen = true
    vm.search = {}
    vm.allocationList = []
    vm.showSearchResult = false

    return
  }

  vm.isAllocationSearchOpen = stateParams.isAllocationSearchOpen
  vm.search = stateParams.search
  vm.allocationList = stateParams.allocationList
  vm.showSearchResult = stateParams.showSearchResult
}

module.exports = {
  getParams: getParams,
  onParamsChanged: onParamsChanged,
  setState: setState
}
