"use strict";

/*jshint camelcase:false*/

var utilities = require('./utilities.js')

var app = angular.module('existing-allocations', [
  'treasury-allocation-service',
  'ngTable'
])

app.directive('existingAllocations', existingAllocationsDirective)

existingAllocationsDirective.$inject = []

function existingAllocationsDirective() {
  return {
    restrict: 'E',
    templateUrl: require('commons')
      .buildUrl('letter-of-credit', 'form-m/treasury-allocation/existing-allocations/existing-allocations.html'),
    controller: 'ExistingAllocationsDirectiveController as existingAllocations',
    scope: true,
    bindToController: {
      allocationList: '='
    }
  }
}

app.controller('ExistingAllocationsDirectiveController', ExistingAllocationsDirectiveController)

ExistingAllocationsDirectiveController.$inject = [
  '$log',
  'NgTableParams'
]

function ExistingAllocationsDirectiveController($log, NgTableParams) {
  var vm = this  // jshint -W040
  var oldFilter = {}

  //:TODO 'finish state restoration codes

  vm.allocationList = utilities.attachBidsToAllocations(vm.allocationList)
  vm.tableParams = new NgTableParams(
    {sorting: {ref: 'desc'}},
    {dataset: vm.allocationList}
  )

  vm.editAllocation = function editAllocation(allocation) {
    vm.allocationToEdit = allocation
    vm.showEditAllocationForm = true
    oldFilter = angular.copy(vm.tableParams.filter())
    vm.tableParams.filter({deal_number: allocation.deal_number})
  }

  //  throw new Error( 'when allocation edited, it is possible that a bid attached to an allocation has now been' +
  //                   ' distributed to another allocation. With the current code, only the newly edited allocation
  // shows' + ' correct amount allocated and outstanding for this bid, but we would like that all allocations' + ' that
  // reference this bid be updated - please code this use case' )
  vm.onAllocationEdited = function onAllocationEdited(allocation, edited) {

    if (edited) {
      vm.tableParams.settings({
        dataset: utilities.replaceAllocation(
          utilities.attachBidsToAllocation(allocation), vm.tableParams.settings().dataset
        )
      })
    }

    vm.showEditAllocationForm = false
    vm.allocationToEdit = null
    vm.tableParams.filter(angular.copy(oldFilter))
    oldFilter = {}
  }
}


