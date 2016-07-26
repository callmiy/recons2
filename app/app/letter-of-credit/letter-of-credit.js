"use strict";

require('./lc/lc.js')

var rootCommons = require('commons')

var app = angular.module('lc-root-app',
  ['rootApp',
   'ui.router',
   'form-m',
   'lc'
  ])

app.config(rootCommons.interpolateProviderConfig)

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
}])

app.config(formMRootAppURLConfig)
formMRootAppURLConfig.$inject = ['$stateProvider', '$urlRouterProvider']
function formMRootAppURLConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      kanmiiTitle: 'Home',
      template: require('./letter-of-credit.html')
    })
}
