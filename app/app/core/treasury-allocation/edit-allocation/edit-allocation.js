"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation-service' )

app.directive( 'editAllocation', editAllocationDirective )

editAllocationDirective.$inject = [ '$log' ]

function editAllocationDirective($log) {

  function editAllocationDirectiveLink(scope, element, attributes, controller) {
    element.find( '.add-bid' ).on( 'click', function () {
      $log.log( controller )
    } )
  }

  return {
    restrict: 'AE',
    templateUrl: require( 'commons' ).buildUrl( 'core', 'treasury-allocation/edit-allocation/edit-allocation.html' ),
    scope: true,
    bindToController: {
      allocation: '=',
      kmTitle: '=',
      onEdited: '&'
    },
    controller: 'editAllocationController as editAllocation',
    link: editAllocationDirectiveLink
  }
}

app.controller( 'editAllocationController', editAllocationController )
editAllocationController.$inject = [ '$log' ]

function editAllocationController($log) {
  var vm = this //jshint -W040
  $log.log( vm.allocation )

  vm.save = function save(bids) {
    $log.log( bids )
  }
}
