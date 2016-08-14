"use strict";

var underscore = require( 'underscore' )

/**
 * We will watch some states of this directive, and when they change, we store than into our app store so that they
 * can be restored later when user navigates away and comes back to our this directive/router state
 * @param vm
 * @param formMAppStore
 */
function storeSate(vm, formMAppStore) {
  formMAppStore.searchAllocationParams = {
    isAllocationSearchOpen: vm.isAllocationSearchOpen,
    search: angular.copy( vm.search ),
    allocationList: angular.copy( vm.allocationList ),
    showSearchResult: vm.showSearchResult
  }
}

/**
 *
 * @param formMAppStore
 * @param vm
 */
function setState(formMAppStore, vm) {
  var searchAllocationParams = formMAppStore.searchAllocationParams

  if ( underscore.isEmpty( searchAllocationParams ) ) {
    vm.isAllocationSearchOpen = true
    vm.search = {}
    vm.allocationList = []
    vm.showSearchResult = false

    return
  }

  vm.isAllocationSearchOpen = searchAllocationParams.isAllocationSearchOpen
  vm.search = searchAllocationParams.search
  vm.allocationList = searchAllocationParams.allocationList
  vm.showSearchResult = searchAllocationParams.showSearchResult
  formMAppStore.searchAllocationParams = null
}

module.exports = {
  setState: setState,
  storeSate: storeSate
}
