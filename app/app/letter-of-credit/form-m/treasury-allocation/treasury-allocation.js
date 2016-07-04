"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation', [
  'ui.router',
  'rootApp'
] )

app.config( treasuryAllocationConfig )
treasuryAllocationConfig.$inject = [ '$stateProvider' ]
function treasuryAllocationConfig($stateProvider) {
  $stateProvider
    .state( 'form_m.treasury_allocation', {

      kanmiiTitle: 'Allocations',

      views: {
        treasuryAllocation: {
          template: require( './treasury-allocation.html' ),

          controller: 'TreasuryAllocationController as treasuryAllocation'
        }
      }
    } )
}

app.controller( 'TreasuryAllocationController', TreasuryAllocationController )
TreasuryAllocationController.$inject = []
function TreasuryAllocationController() {
  var vm = this
}