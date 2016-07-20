"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation-service' )

app.directive( 'editAllocation', editAllocationDirective )

editAllocationDirective.$inject = []

function editAllocationDirective() {
  return {
    restrict: 'AE',
    templateUrl: require( 'commons' ).buildUrl( 'app', 'treasury-allocation/edit-allocation/edit-allocation.html' ),
    scope: true,
    bindToController: {
      allocation: '=',
      kmTitle: '=',
      onEdited: '&'
    },
    controller: 'editAllocationController as editAllocation'
  }
}

app.controller( 'editAllocationController', editAllocationController )
editAllocationController.$inject = []

function editAllocationController() {
  var vm = this //jshint -W040

  vm.editAllocation = function editAllocation(allocation) {
    vm.allocationToEdit = allocation
    vm.showEditAllocationForm = true
  }

  vm.dismissEditAllocationForm = function dismissEditAllocationForm() {
    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
  }

  vm.onAllocationEdited = function onAllocationEdited() {

  }
}
