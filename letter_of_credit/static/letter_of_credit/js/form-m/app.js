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

      resolve: {
        formMs: ['FormM', function(FormM) {
          return FormM.query().$promise
        }]
      },

      controller: 'HomeController as formMHome'
    })
}

app.controller('HomeController', HomeController)
HomeController.$inject = ['formMs']
function HomeController(formMs) {
  var vm = this;
  vm.formMs = formMs
}

require('./table')
require('./add-form-m')
