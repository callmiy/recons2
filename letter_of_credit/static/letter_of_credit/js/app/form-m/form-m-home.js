"use strict"

/*jshint camelcase:false*/

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'list-form-m',
   'upload-form-m'
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
FormMController.$inject = ['$state']
function FormMController($state) {
  var vm = this

  vm.tabs = [
    {
      title: 'Upload Form M', viewName: 'uploadFormM', select:function(){ $state.go('form_m.upload')}
    },

    {
      title: 'List Form M', active: true, viewName: 'listFormM', select:function(){ $state.go('form_m.list')}
    }
  ]
}
