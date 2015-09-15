"use strict";

require('./post-neg')
require('./deferred-payment')
require('./create-new')

var commons = require('commons')

var app = angular.module('letterOfCreditPayment',
  ['rootApp',
    'ui.router',
    'rootApp.search_lc',
    'letterOfCreditPayment.deferred_payment',
    'letterOfCreditPayment.post_neg'
  ])

commons.setStaticPrefix(app)
app.config(require('commons').interpolateProviderConfig)

app.run(['$rootScope', '$state', '$stateParams', function letterOfCreditPaymentRun($rootScope, $state, $stateParams) {
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
}])

app.config(['$stateProvider', '$urlRouterProvider',
  function letterOfCreditPaymentURLConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/')

    $stateProvider
      .state('home', {
        url: '/'
      })
  }])
