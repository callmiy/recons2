"use strict";

/*jshint camelcase:false*/

var store = require( './store-state' )

var app = angular.module( 'add-fx-allocation', [
  'fx-deal-service',
  'rootApp',
  'complex-object-validator'
] )

app.directive( 'addFxAllocation', addFxAllocationDirective )
addFxAllocationDirective.$inject = [ 'addDealStore' ]

function addFxAllocationDirective(addDealStore) {
  function link(scope, $elm, attrs, ctrl) {
    scope.$on( '$destroy', function () {
      if ( ctrl.doNoSaveState === true ) {
        addDealStore.dealStore = null
        return
      }

      store.storeState( ctrl, addDealStore )
    } )
  }

  return {
    restrict: 'AE',
    template: require( './add-deal.html' ),
    scope: true,
    bindToController: {
      initialDealProps: '=',
      kmTitle: '=',
      onFxAllocated: '&'
    },
    controller: 'addFxAllocationController as fxDeal',
    link: link
  }
}

app.controller( 'addFxAllocationController', addFxAllocationController )
addFxAllocationController.$inject = [
  'getTypeAheadCurrency',
  'resetForm2',
  'toISODate',
  'FxDeal',
  'addDealStore',
  '$scope'
]
function addFxAllocationController(getTypeAheadCurrency, resetForm2, toISODate, FxDeal, addDealStore, $scope) {
  var vm = this //jshint -W040

  var initialDealProps = vm.initialDealProps ? angular.copy( vm.initialDealProps ) : {}

  init()
  function init() {
    store.init( vm, initialDealProps )
  }

  store.setState( addDealStore, vm, initialDealProps )

  vm.disableSubmitBtn = function disableSubmitBtn(form) {
    if ( form.$invalid ) return true
    if ( vm.deal.amount_utilized && !vm.deal.utilized_on ) return true

    return (!vm.deal.amount_utilized && vm.deal.utilized_on
    )
  }

  vm.getCurrency = getTypeAheadCurrency
  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.openDatePickerFor = function openDatePickerFor(element) {
    vm.datePickerIsOpenFor[ element ] = true
  }

  vm.clearForm = function clearForm(form) {
    resetForm2( form )
    init()
  }

  vm.saveDeal = function saveDeal(deal) {
    deal = angular.copy( deal )
    deal.allocated_on = toISODate( deal.allocated_on )
    deal.utilized_on = toISODate( deal.utilized_on )
    deal.currency = deal.currency.url

    FxDeal.save( deal ).$promise.then( function (data) {
      vm.onFxAllocated( { result: data } )
    }, function (error) {
      vm.onFxAllocated( { result: error } )

    } ).finally( function () {
      vm.doNoSaveState = true
    } )
  }

  $scope.$on( 'add-deal-do-not-save', function () {
    vm.doNoSaveState = true
  } )
}

require( './add-deal-store' )
