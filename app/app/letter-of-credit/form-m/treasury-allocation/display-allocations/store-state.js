"use strict";

var underscore = require( 'underscore' )

function setNgTableParams(tableParams) {
  return {
    filter: tableParams.filter(),
    sorting: tableParams.sorting()
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

function storeSate(vm, formMAppStore) {
  formMAppStore.treasuryAllocation.displayAllocationParams = {
    ngTableParams: setNgTableParams( vm.tableParams ),
    showEditAllocationForm: vm.showEditAllocationForm,
    selectedAllocations: vm.selectedAllocations,
    allocationToEdit: vm.allocationToEdit,
    oldFilter: vm.oldFilter
  }
}

/**
 *
 * @param stateParams
 * @param vm
 * @param oldFilter
 * @param NgTableParams
 */
function restoreState(stateParams, vm, NgTableParams) {
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
  vm.oldFilter = stateParams.oldFilter
  stateParams = {}
}

module.exports = {
  restoreState: restoreState,
  storeSate: storeSate
}
