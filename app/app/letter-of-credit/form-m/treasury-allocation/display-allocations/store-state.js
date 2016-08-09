"use strict";

var underscore = require( 'underscore' )

function setNgTableParams(tableParams) {
  return {
    filter: angular.copy( tableParams.filter() ),
    sorting: angular.copy( tableParams.sorting() )
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
    allocationToEdit: angular.copy( vm.allocationToEdit ),
    oldFilter: angular.copy( vm.oldFilter )
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
  vm.selectedAllocations = {}

  if ( underscore.isEmpty( stateParams ) ) {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null

    return
  }

  var params = getNgTableParams( stateParams.ngTableParams )
  vm.tableParams.filter( params.params.filter )
  vm.tableParams.sorting( params.params.sorting )
  vm.showEditAllocationForm = stateParams.showEditAllocationForm
  vm.allocationToEdit = stateParams.allocationToEdit
  vm.oldFilter = stateParams.oldFilter
  stateParams = null
}

module.exports = {
  restoreState: restoreState,
  storeSate: storeSate
}
