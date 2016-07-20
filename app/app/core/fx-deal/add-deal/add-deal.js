"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'add-fx-allocation', [
  'fx-deal-service',
  'rootApp',
  'complex-object-validator'
] )

app.directive( 'addFxAllocation', addFxAllocationDirective )

addFxAllocationDirective.$inject = []

function addFxAllocationDirective() {
  return {
    restrict: 'AE',
    template: require( './add-deal.html' ),
    scope: true,
    bindToController: {
      initialDealProps: '=',
      kmTitle: '=',
      onFxAllocated: '&'
    },
    controller: 'addFxAllocationController as fxDeal'
  }
}

app.controller( 'addFxAllocationController', addFxAllocationController )
addFxAllocationController.$inject = [
  'getTypeAheadCurrency',
  'resetForm2',
  'toISODate',
  'FxDeal'
]
function addFxAllocationController(getTypeAheadCurrency, resetForm2, toISODate, FxDeal) {
  var vm = this //jshint -W040

  var initialDealProps = vm.initialDealProps ? angular.copy( vm.initialDealProps ) : {}

  init()
  function init() {
    vm.deal = {
      deal_number: null,
      currency: initialDealProps.currency ? initialDealProps.currency : null,
      amount_allocated: initialDealProps.amount_allocated ? initialDealProps.amount_allocated : null,
      allocated_on: new Date(),
      amount_utilized: initialDealProps.amount_utilized ? initialDealProps.amount_utilized : null,
      utilized_on: new Date(),
      content_type: initialDealProps.content_type,
      object_id: initialDealProps.object_id
    }

    vm.datePickerIsOpenFor = {
      dealDate: false,
      dealDateUtilized: false
    }
  }

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

    new FxDeal( deal ).$save( function (data) {
      vm.onFxAllocated( { result: data } )
    }, function (error) {
      vm.onFxAllocated( { result: error } )
    } )
  }
}

app.directive( 'requiredTogether', requiredTogether )

function requiredTogether() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, attributes, ctrl) {
      ctrl.$validators.requiredTogether = function () {
        if ( attributes.required ) return true
        else {
          var relatedTo = attributes.kmRelatedTo
          if ( ctrl.$modelValue ) {
            console.log( $scope.$eval( relatedTo ) )
          }
        }

        return true
      }
    }
  }
}
