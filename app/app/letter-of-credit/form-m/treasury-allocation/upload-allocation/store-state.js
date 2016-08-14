"use strict";

var underscore = require( 'underscore' )

/**
 * When the directive is about to be destroyed, we store some states into our app store so that they
 * can be restored later when user navigates away and comes back to this directive
 * @param vm
 * @param formMAppStore
 */
function storeSate(vm, formMAppStore) {
  formMAppStore.uploadAllocationParams = {
    showPasteForm: vm.showPasteForm,
    isSaving: vm.isSaving,
    allocationList: angular.copy( vm.allocationList ),
    rejectedDataList: vm.rejectedDataList,
    pastedBlotter: vm.pastedBlotter,
    invalidPastedTextMsg: vm.invalidPastedTextMsg,
    bidsFromServer: vm.bidsFromServer
  }
}

/**
 *
 * @param formMAppStore
 * @param vm
 */
function setState(formMAppStore, vm) {
  var uploadAllocationParams = formMAppStore.uploadAllocationParams

  if ( underscore.isEmpty( uploadAllocationParams ) ) {
    vm.showPasteForm = true
    vm.isSaving = false
    vm.allocationList = null
    vm.rejectedDataList = null
    vm.pastedBlotter = ''
    vm.invalidPastedTextMsg = ''
    vm.bidsFromServer = []

    return
  }

  vm.showPasteForm = uploadAllocationParams.showPasteForm
  vm.isSaving = uploadAllocationParams.isSaving
  vm.allocationList = uploadAllocationParams.allocationList
  vm.rejectedDataList = uploadAllocationParams.rejectedDataList
  vm.pastedBlotter = uploadAllocationParams.pastedBlotter
  vm.invalidPastedTextMsg = uploadAllocationParams.invalidPastedTextMsg
  vm.bidsFromServer = uploadAllocationParams.bidsFromServer
  formMAppStore.uploadAllocationParams = null
}

module.exports = {
  setState: setState,
  storeSate: storeSate
}
