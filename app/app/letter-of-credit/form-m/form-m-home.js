"use strict"

/*jshint camelcase:false*/

require( './add-form-m/form-m-object.js' )
require( './add-form-m/add-form-m.js' )
require( './lc-bid/lc-bid.js' )
require( './bids/bids.js' )
require( './list-form-m/list-form-m.js' )
require( './search-detailed-or-uploaded-form-m/search-detailed-or-uploaded-form-m.js' )
require( './search-form-m/search-form-m.js' )
require( './upload-form-m/upload-form-m.js' )
require( './display-uploaded-form-m-modal/display-uploaded-form-m-modal.js' )

var app = angular.module( 'form-m',
  [ 'rootApp',
    'ui.router',
    'list-form-m',
    'upload-form-m',
    'add-form-m',
    'form-m-bids',
    'add-form-m-form-m-object',
    'ngSanitize',
    'lc-bid',
    'treasury-allocation'
  ] )


/**
 * Basically for storing the formM number of the current form M when in formM.add view
 */
app.value( 'formMAppStore', {
  formMNumber: null,
  treasuryAllocation: {
    uploadAllocationParams: {},
    treasuryAllocationParams: {}
  }
} )

app.config( formMURLConfig )
formMURLConfig.$inject = [ '$stateProvider' ]
function formMURLConfig($stateProvider) {

  $stateProvider
    .state( 'form_m', {
      url: '/form-m',

      kanmiiTitle: 'Form M',

      template: require( './form-m-home.html' ),

      controller: 'FormMController as formMHome'
    } )
}

app.controller( 'FormMController', FormMController )
FormMController.$inject = [ '$state', '$scope', 'formMAppStore', '$rootScope' ]
function FormMController($state, $scope, formMAppStore, $rootScope) {
  var vm = this

  var listFormMTab = {
    className: 'list-form-m-tab-ctrl',
    title: 'List Form M',
    viewName: 'listFormM',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go( 'form_m.list' )
    }
  }

  var addFormMTitle = 'Form M'
  var addFormMTab = {
    className: 'add-form-tab-ctrl',
    title: addFormMTitle,
    active: true,
    viewName: 'addFormM',
    select: function () {
      $state.go( 'form_m.add' )
    }
  }

  var treasuryAllocationTab = {
    title: 'Allocations',
    active: false,
    viewName: 'treasuryAllocation',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go( 'form_m.treasury_allocation' )
    }
  }

  var listBidsTab = {
    className: 'bid-list-tab-ctrl',
    title: 'List All Bids',
    active: false,
    viewName: 'bids',
    select: function () {
      vm.tabContent = null
      $scope.updateAddFormMTitle()
      $state.go( 'form_m.bids' )
    }
  }

  var bidTitle = 'Bid'
  var bidTab = {
    className: 'cash-backed-lc-bid-tab',
    title: bidTitle,
    active: false,
    viewName: 'lcBid',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go( 'form_m.lc_bid' )
    }
  }

  vm.tabs = {
    listFormM: listFormMTab,
    addFormM: addFormMTab,
    bid: bidTab,
    bids: listBidsTab,
    treasuryAllocation: treasuryAllocationTab
  }

  vm.activeIndex = 1

  $scope.updateAddFormMTitle = function (formM) {
    vm.tabs.addFormM.title = addFormMTitle
    vm.tabs.bid.title = bidTitle

    if ( formM || formMAppStore.formMNumber ) {
      var formMNumber = formM ? formM.number : formMAppStore.formMNumber
      vm.tabs.bid.title = 'Bids for "' + formMNumber + '"'
      vm.tabs.addFormM.title = 'Details of "' + formMNumber + '"'
    }
  }

  $scope.goToFormM = function goToFormM(formMNumber) {
    $state.transitionTo( 'form_m.add', { formM: formMNumber } )
    vm.activeIndex = 1
    $scope.updateAddFormMTitle( formMNumber )
  }

  $rootScope.$on( '$stateChangeStart', function (evt, toState, toParams) {
    if ( toState.name === 'form_m.add' ) {
      if ( !toParams.formM ) {
        toParams.formM = formMAppStore.formMNumber
        toParams.showSummary = null;
      }
    }

    if ( toState.name === 'form_m.treasury_allocation' ) {
      toParams.uploadAllocationParams = formMAppStore.treasuryAllocation.uploadAllocationParams
      toParams.treasuryAllocationParams = formMAppStore.treasuryAllocation.treasuryAllocationParams
    }
  } )
}
