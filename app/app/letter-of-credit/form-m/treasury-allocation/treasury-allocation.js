"use strict";

/*jshint camelcase:false*/

require( './upload-allocation/upload-allocation.js' )
require( './download-bids/download-bids.js' )

var app = angular.module( 'treasury-allocation', [
  'ui.router',
  'upload-treasury-allocation',
  'allocation-download-bids',
  'rootApp'
] )

app.config( treasuryAllocationConfig )
treasuryAllocationConfig.$inject = [ '$stateProvider' ]
function treasuryAllocationConfig($stateProvider) {
  $stateProvider
    .state( 'form_m.treasury_allocation', {

      kanmiiTitle: 'Allocations',

      params: {
        uploadAllocationParams: {},
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

  vm.uploadAllocationParams = $stateParams.uploadAllocationParams

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
