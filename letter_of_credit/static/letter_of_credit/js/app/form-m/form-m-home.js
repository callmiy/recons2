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
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go('form_m.list')
    }
  }

  var addFormMTitle = 'Form M'
  /** Angular uib tab executes 'select' function which invokes $state.go. However, if we are transiting to this state
   from a place outside angular uib tab, this will result in the state transition function been called twice (see
   "$scope.goToFormM" function below for example) - one for the calling position and another for angular uib tab. This
   flag keeps track of whether state transition function had been called and thus helps to avoid duplicate call. A
   consequence of the duplicate call is that the controller for the addFormMTab is called twice with all sorts of
   unintended consequences.
   */
  var addFormMGoTo = true
  var addFormMTab = {
    title: addFormMTitle,
    active: true,
    viewName: 'addFormM',
    select: function () {
      if (addFormMGoTo) $state.go('form_m.add')
      addFormMGoTo = true
    }
  }

  var reportsTab = {
    title: 'Reports',
    active: false,
    viewName: 'formMReports',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go('form_m.add')
    }
  }

  var bidsTab = {
    title: 'Pending Bids',
    active: false,
    viewName: 'bids',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go('form_m.bids')
    }
  }

  var uploadFormMTab = {
    title: 'Upload Form M',
    active: false,
    viewName: 'uploadFormM',
    select: function () {
      $scope.updateAddFormMTitle()
      $state.go('form_m.upload')
    }
  }

  $scope.tabs = {
    uploadFormM: uploadFormMTab,
    listFormM: listFormMTab,
    addFormM: addFormMTab,
    bids: bidsTab,
    reports: reportsTab
  }

  $scope.updateAddFormMTitle = function (formM) {
    $scope.tabs.addFormM.title = formM ? 'Details of "' + formM.number + '"' : addFormMTitle
  }

  $scope.goToFormM = function goToFormM(formM) {
    addFormMGoTo = false
    $state.transitionTo('form_m.add', {detailedFormM: formM})
    $scope.tabs.addFormM.active = true
  }
}
