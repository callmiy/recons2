"use strict"

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'list-form-m',
   'upload-form-m',
   'add-form-m-state'
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
  var vm = this

  var uploadFormMTab = {
    title: 'Upload Form M',
    viewName: 'uploadFormM',
    select: function() { $state.go('form_m.upload')}
  }

  var listFormMTab =  {
    title: 'List Form M',
    active: true,
    viewName: 'listFormM',
    select: function() { $state.go('form_m.list')}
  }

  var addFormMTab = {
    title: 'Add Form M',
    viewName: 'addFormM',
    select: function() { $state.go('form_m.add')}
  }

  vm.tabs = [uploadFormMTab, listFormMTab, addFormMTab]

  $scope.tabs = { uploadFormM: uploadFormMTab, listFormM: listFormMTab, addFormM: addFormMTab}
}
