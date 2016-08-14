"use strict"

var app = angular.module( 'form-m-app-store', [] )

app.value( 'formMAppStore', {
  formMNumber: null,
  treasuryAllocation: {
    treasuryAllocationParams: {}
  }
} )

app.factory( 'restoreTreasuryAllocationApp', restoreTreasuryAllocationApp )
restoreTreasuryAllocationApp.$inject = [ 'formMAppStore' ]

function restoreTreasuryAllocationApp(formMAppStore) {
  function restore(toState, toParams) {
    if ( toState.name === 'form_m.treasury_allocation' ) {
      toParams.treasuryAllocationParams = formMAppStore.treasuryAllocation.treasuryAllocationParams
    }
  }

  return restore
}

app.factory( 'restoreFormMApp', restoreFormMApp )
restoreFormMApp.$inject = [ 'formMAppStore' ]

function restoreFormMApp(formMAppStore) {
  function restore(toState, toParams) {
    if ( toState.name === 'form_m.add' ) {
      if ( !toParams.formM ) {
        toParams.formM = formMAppStore.formMNumber
        toParams.showSummary = null;
      }
    }
  }

  return restore
}
