"use strict";

var underscore = require( 'underscore' )

function setNgTableParams(tableParams) {
  return {
    filter: tableParams.filter(),
    sorting: tableParams.sorting()
  }
}

function getParams(vm, oldFilter) {
  return function getExistingAllocationParams() {
    return {
      ngTableParams: setNgTableParams( vm.tableParams ),
      showEditAllocationForm: vm.showEditAllocationForm,
      allocationToEdit: vm.allocationToEdit,
      selectedAllocations: vm.selectedAllocations,
      oldFilter: oldFilter
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
function onParamsChanged(vm, oldFilter, formMAppStore) {

  return function storeExistingAllocation() {
    //console.log( 'setNgTableParams( vm.tableParams ) = ', setNgTableParams( vm.tableParams ) )
    formMAppStore.treasuryAllocation.displayAllocationParams = {
      ngTableParams: setNgTableParams( vm.tableParams ),
      showEditAllocationForm: vm.showEditAllocationForm,
      selectedAllocations: vm.selectedAllocations,
      allocationToEdit: vm.allocationToEdit,
      oldFilter: oldFilter
    }
  }
}

function getNgTableParams(params) {

  if ( underscore.isEmpty( params ) ) return {
    params: { sorting: { ref: 'desc' } }
  }

  return {
    params: { sorting: params.sorting, filter: params.filter }
  }
}

/**
 *
 * @param stateParams
 * @param vm
 * @param oldFilter
 * @param NgTableParams
 */
function setState(stateParams, vm, oldFilter, NgTableParams) {
  vm.tableParams = new NgTableParams( { sorting: { ref: 'desc' } }, { dataset: vm.allocationList } )

  if ( underscore.isEmpty( stateParams ) ) {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
    vm.selectedAllocations = {}

    return
  }

  var params = getNgTableParams( stateParams.ngTableParams )
  vm.tableParams.filter( params.params.filter )
  vm.tableParams.sorting( params.params.sorting )
  vm.showEditAllocationForm = stateParams.showEditAllocationForm
  vm.allocationToEdit = stateParams.allocationToEdit
  vm.selectedAllocations = stateParams.selectedAllocations
  oldFilter = stateParams.oldFilter
}

module.exports = {
  getParams: getParams,
  onParamsChanged: onParamsChanged,
  setState: setState
}
