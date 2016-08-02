"use strict";

var app = angular.module( 'spinner-modal', [ 'angularSpinner' ] )

app.controller( 'spinnerModalController', spinnerModalController )
spinnerModalController.$inject = [
  'title'
]

function spinnerModalController(title) {
  var vm = this //jshint -W040
  vm.spinnerName = 'spinnerModalSpinner'
  vm.title = title
}

app.factory( 'spinnerModal', spinnerModal )
spinnerModal.$inject = [ '$uibModal' ]

function spinnerModal($uibModal) {
  return function modalInstance(title) {
    return $uibModal.open( {
      templateUrl: require( 'commons' ).buildUrl( 'core', 'spinner-modal/spinner-modal.html' ),
      controller: 'spinnerModalController as spinnerModal',
      windowClass: 'spinner-modal',
      size: 'sm',
      resolve: {
        title: function () {
          return title
        }
      }
    } )
  }
}
