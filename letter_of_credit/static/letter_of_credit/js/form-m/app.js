"use strict";

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router'
  ])

//rootCommons.setStaticPrefix(app)
app.config(rootCommons.interpolateProviderConfig)

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
}])

app.config(formMURLConfig)
formMURLConfig.$inject = ['$stateProvider', '$urlRouterProvider']
function formMURLConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',

      controller: 'HomeController as formMHome'
    })
}

app.controller('HomeController', HomeController)
HomeController.$inject = ['FormM', '$scope']
function HomeController(FormM, scope) {
  var vm = this;

  vm.formMs = FormM.getPaginated()

  scope.$watch(function getNewFormM() {return vm.newFormM}, function(newFormM) {
    if (newFormM){
      vm.formMs.results.pop()
      vm.formMs.results.unshift(newFormM)
    }
  })
}

require('./table')
require('./lc-issue')
require('./add-form-m')
