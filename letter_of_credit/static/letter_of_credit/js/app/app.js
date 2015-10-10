"use strict";

require('./bid-request/add-bid/add-bid.js')
require('./bid-request/display-pending-bid/display-pending-bid.js')
require('./bid-request/add-bid-service/add-bid-service.js')
require('./bid-request/bid-request-home.js')
require('./bid-request/edit-bid/edit-bid.js')
require('./form-m/add-form-m/add-form-m.js')
require('./form-m/search-form-m-service/search-form-m-service.js')
require('./form-m/search-form-m')
require('./form-m/lc-issue/lc-issue.js')
require('./form-m/form-m-home.js')
require('./lc/lc.js')

var rootCommons = require('commons')

var app = angular.module('lc-root-app',
  ['rootApp',
   'ui.router',
   'form-m',
   'form-m-bid'
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

      template: require('./app.html')
    })
}
