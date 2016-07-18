"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'treasury-allocation' )

app.directive( 'displayBidsForAllocation', displayBidsForAllocation )

function displayBidsForAllocation() {
  return {
    restrict: 'AE',
    templateUrl: require( 'commons' )
      .buildUrl(
        'letter-of-credit', 'form-m/treasury-allocation/display-bids-for-allocation/display-bids-for-allocation.html'
      ),
    controller: 'DisplayBidsForAllocation as bidsForAllocation',
    replace: true
  }
}

app.controller( 'DisplayBidsForAllocation', DisplayBidsForAllocation )
DisplayBidsForAllocation.$inject = [ '$scope', '$attrs', 'underscore' ]

function DisplayBidsForAllocation($scope, $attr, underscore) {
  var vm = this

  var allocation = $scope.$eval( $attr.allocation ),
    bids = allocation.bids

  console.log( 'allocation = ', allocation )
  console.log( 'bids = ', bids, '\n\n' )
}
