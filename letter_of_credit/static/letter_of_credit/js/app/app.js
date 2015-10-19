"use strict";

require('./bid-request/add-bid/add-bid.js')
require('./bid-request/display-pending-bid/display-pending-bid.js')
require('./bid-request/add-bid-service/add-bid-service.js')
require('./bid-request/bid-request-home.js')
require('./bid-request/edit-bid/edit-bid.js')
require('./form-m/add-form-m/add-form-m.js')
require('./form-m/add-form-m-state/add-form-m-state.js')
require('./form-m/search-form-m-service/search-form-m-service.js')
require('./form-m/search-form-m')
require('./form-m/upload-form-m/search-uploaded-form-m/search-uploaded-form-m.js')
require('./form-m/upload-form-m/upload-form-m.js')
require('./form-m/list-form-m/list-form-m.js')
require('./form-m/lc-issue/lc-issue.js')
require('./form-m/form-m-home.js')
require('./lc/lc.js')
require('./lc/lc-detail/lc-detail.js')
require('./lc/search-lc/search-lc.js')

var rootCommons = require('commons')

var app = angular.module('lc-root-app',
  ['rootApp',
   'ui.router',
   'form-m',
   'form-m-bid',
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

      template: require('./app.html')
    })
}