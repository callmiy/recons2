"use strict";

var underscore = require( 'underscore' )

function setNgTableParams(tableParams) {
  return {
    filter: tableParams.filter(),
    sorting: tableParams.sorting(),
    data: tableParams.data
  }
}

function getParams(vm, oldFilter) {
  return function getExistingAllocationParams() {
    return {
      ngTableParams: setNgTableParams( vm.tableParams ),
      showEditAllocationForm: vm.showEditAllocationForm,
      allocationToEdit: vm.allocationToEdit,
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
    formMAppStore.treasuryAllocation.existingAllocationParams = {
      ngTableParams: setNgTableParams( vm.tableParams ),
      showEditAllocationForm: vm.showEditAllocationForm,
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
    params: { sorting: params.sorting, filter: params.filter },
    data: params.data
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

  if ( underscore.isEmpty( stateParams ) ) {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null

    vm.tableParams = new NgTableParams(
      { sorting: { ref: 'desc' } },
      { dataset: vm.allocationList }
    )

    return
  }

  var params = getNgTableParams( stateParams.ngTableParams )
  vm.tableParams = new NgTableParams( params.params, { dataset: vm.allocationList } )
  vm.tableParams.data = params.data
  vm.showEditAllocationForm = stateParams.showEditAllocationForm
  vm.allocationToEdit = stateParams.allocationToEdit
  oldFilter = stateParams.oldFilter
}

module.exports = {
  getParams: getParams,
  onParamsChanged: onParamsChanged,
  setState: setState
}
