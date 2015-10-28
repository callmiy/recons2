"use strict"

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'list-form-m',
   'upload-form-m',
   'add-form-m'
  ])

app.config(rootCommons.interpolateProviderConfig)

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
  //var vm = this

  var uploadFormMTab = {
    title: 'Upload Form M',
    viewName: 'uploadFormM',
    select: function() { $state.go('form_m.upload')}
  }

  var listFormMTab = {
    title: 'List Form M',
    viewName: 'listFormM',
    select: function() { $state.go('form_m.list')}
  }

  var addFormMTitle = 'Add Form M'

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
    select: function() { $state.go('form_m.add')}
  }

  $scope.tabs = {
    uploadFormM: uploadFormMTab,
    listFormM: listFormMTab,
    addFormM: addFormMTab,
    reportsTab: reportsTab
  }

  $scope.updateAddFormMTitle = function(formM) {
    $scope.tabs.addFormM.title = formM ? 'Details of "' + formM.number + '"' : addFormMTitle
  }
}
