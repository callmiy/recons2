"use strict";

var app = angular.module( 'treasury-allocation-service' )

app.controller( 'editAllocationModalController', editAllocationModalController )
editAllocationModalController.$inject = [
  '$uibModalInstance'
]

function editAllocationModalController($uibModalInstance) {
  var vm = this //jshint -W040

  vm.ok = function ok() {
    $uibModalInstance.close( true )
  }

  vm.cancel = function cancel() {
    $uibModalInstance.dismiss( 'cancel' )
  }
}

app.factory( 'editAllocationModal', editAllocationModal )
editAllocationModal.$inject = [ '$uibModal' ]

function editAllocationModal($uibModal) {
  function modalInstance() {
    return $uibModal.open( {
      templateUrl: require( 'commons' ).buildUrl(
        'core',
        'treasury-allocation/edit-allocation/edit-allocation-modal/edit-allocation-modal.html' ),

      controller: 'editAllocationModalController as editAllocationModal',

      size: 'sm'
    } )
  }

  return modalInstance
}
