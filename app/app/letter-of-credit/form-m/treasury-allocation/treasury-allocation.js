"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation', [
  'ui.router',
  'upload-treasury-allocation',
  'allocation-download-bids',
  'search-allocations',
  'rootApp'
] )

app.config( treasuryAllocationConfig )
treasuryAllocationConfig.$inject = [ '$stateProvider' ]

function treasuryAllocationConfig($stateProvider) {
  $stateProvider
    .state( 'form_m.treasury_allocation', {

      kanmiiTitle: 'Allocations',

      params: {
        treasuryAllocationParams: {}
      },

      views: {
        treasuryAllocation: {
          template: require( './treasury-allocation.html' ),

          controller: 'TreasuryAllocationController as treasuryAllocation'
        }
      }
    } )
}

app.controller( 'TreasuryAllocationController', TreasuryAllocationController )
TreasuryAllocationController.$inject = [
  '$stateParams',
  '$scope',
  'formMAppStore'
]

function TreasuryAllocationController($stateParams, $scope, formMAppStore) {
  var vm = this

  var treasuryAllocationParams = $stateParams.treasuryAllocationParams
  vm.action = treasuryAllocationParams.action

  function getParams() {
    return {
      action: vm.action
    }
  }

  function onParamsChanged() {
    formMAppStore.treasuryAllocation.treasuryAllocationParams = {
      action: vm.action
    }
  }

  $scope.$watch( getParams, onParamsChanged, true )
}
