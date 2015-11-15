"use strict"

/*jshint camelcase:false*/

require('./add-form-m/add-form-m.js')
require('./bids/bids.js')
require('./list-form-m/list-form-m.js')
require('./search-detailed-or-uploaded-form-m/search-detailed-or-uploaded-form-m.js')
require('./search-form-m-service/search-form-m-service.js')
require('./search-form-m')
require('./upload-form-m/upload-form-m.js')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'list-form-m',
   'upload-form-m',
   'add-form-m',
   'form-m-bids'
  ])

app.config(formMURLConfig)
formMURLConfig.$inject = ['$stateProvider']
function formMURLConfig($stateProvider) {

  $stateProvider
    .state('form_m', {
      url: '/form-m',

      kanmiiTitle: 'Form M',

      template: require('./form-m-home.html'),

      controller: 'FormMController as formMHome'
    })
}

app.controller('FormMController', FormMController)
FormMController.$inject = ['$state', '$scope']
function FormMController($state, $scope) {

  var listFormMTab = {
    title: 'List Form M',
    viewName: 'listFormM',
    select: function() {
      $scope.updateAddFormMTitle()
      $state.go('form_m.list')
    }
  }

  var addFormMTitle = 'Form M'

  var addFormMTab = {
    title: addFormMTitle,
    active: true,
    viewName: 'addFormM',
    select: function() { $state.go('form_m.add')}
  }

  var reportsTab = {
    title: 'Reports',
    active: false,
    viewName: 'formMReports',
    select: function() {
      $scope.updateAddFormMTitle()
      $state.go('form_m.add')
    }
  }

  var bidsTab = {
    title: 'Pending Bids',
    active: false,
    viewName: 'bids',
    select: function() {
      $scope.updateAddFormMTitle()
      $state.go('form_m.bids')
    }
  }

  $scope.tabs = {
    listFormM: listFormMTab,
    addFormM: addFormMTab,
    bids: bidsTab,
    reports: reportsTab
  }

  $scope.updateAddFormMTitle = function(formM) {
    $scope.tabs.addFormM.title = formM ? 'Details of "' + formM.number + '"' : addFormMTitle
  }

  $scope.goToFormM = function goToFormM(formM) {
    $state.go('form_m.add', {detailedFormM: formM})
    $scope.tabs.addFormM.active = true
  }
}
