"use strict";

var underscore = require( 'underscore' )

/**
 * We will watch some states of this directive, and when they change, we store than into our app store so that they
 * can be restored later when user navigates away and comes back to our this directive/router state
 * @param vm
 * @param formMAppStore
 */
function storeSate(vm, formMAppStore) {
  formMAppStore.treasuryAllocation.searchAllocationParams = {
    isAllocationSearchOpen: vm.isAllocationSearchOpen,
    search: angular.copy( vm.search ),
    allocationList: angular.copy( vm.allocationList ),
    showSearchResult: vm.showSearchResult
  }
}

/**
 *
 * @param stateParams
 * @param vm
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

  stateParams = null
}

module.exports = {
  setState: setState,
  storeSate: storeSate
}
