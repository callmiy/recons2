"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation' )

app.directive( 'uploadAllocationErrorDisplay', uploadAllocationErrorDisplayDirective )
uploadAllocationErrorDisplayDirective.$inject = []

function uploadAllocationErrorDisplayDirective() {
  return {
    restrict: 'E',
    templateUrl: require( 'commons' )
      .buildUrl(
        'letter-of-credit',
        'form-m/treasury-allocation/upload-allocation/upload-allocation-error-display/upload-allocation-error-display.html' ),
    scope: true,
    bindToController: {
      rejectedDataList: '='
    },
    controller: 'uploadAllocationErrorDisplayDirectiveController as uploadAllocationErrorDisplay'
  }
}

app.controller( 'uploadAllocationErrorDisplayDirectiveController', uploadAllocationErrorDisplayDirectiveController )
uploadAllocationErrorDisplayDirectiveController.$inject = [ 'NgTableParams' ]

function uploadAllocationErrorDisplayDirectiveController(NgTableParams) {
  var vm = this // jshint -W040

  vm.tableParams = new NgTableParams( {}, { dataset: vm.rejectedDataList } )
}
