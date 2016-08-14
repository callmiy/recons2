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
  formMAppStore.displayAllocationParams = {
    ngTableParams: setNgTableParams( vm.tableParams ),
    showEditAllocationForm: vm.showEditAllocationForm,
    allocationToEdit: angular.copy( vm.allocationToEdit ),
    oldFilter: angular.copy( vm.oldFilter )
  }
}

/**
 *
 * @param {{}} formMAppStore
 * @param  vm
 * @param  NgTableParams
 */
function restoreState(formMAppStore, vm, NgTableParams) {
  vm.tableParams = new NgTableParams( { sorting: { ref: 'desc' } }, { dataset: vm.allocationList } )
  vm.selectedAllocations = {}
  var displayAllocationParams = formMAppStore.displayAllocationParams

  if ( underscore.isEmpty( displayAllocationParams ) ) {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null

    return
  }

  var params = getNgTableParams( displayAllocationParams.ngTableParams )
  vm.tableParams.filter( params.params.filter )
  vm.tableParams.sorting( params.params.sorting )
  vm.showEditAllocationForm = displayAllocationParams.showEditAllocationForm
  vm.allocationToEdit = displayAllocationParams.allocationToEdit
  vm.oldFilter = displayAllocationParams.oldFilter
  formMAppStore.displayAllocationParams = null
}

module.exports = {
  restoreState: restoreState,
  storeSate: storeSate
}
