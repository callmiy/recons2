"use strict";

/*globals angular*/

require('./post-neg')
require('./deferred-payment')

angular.module('letterOfCreditPayment',
  ['rootApp',
   'ui.router',
   'letterOfCreditPayment.deferred_payment',
   'letterOfCreditPayment.post_neg'
  ])

  .config(require('commons').interpolateProviderConfig)

  .run(['$rootScope', '$state', '$stateParams', function letterOfCreditPaymentRun($rootScope, $state, $stateParams) {
    $rootScope.$state = $state
    $rootScope.$stateParams = $stateParams
  }])

  .config(['$stateProvider', '$urlRouterProvider',
           function letterOfCreditPaymentURLConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/')

    $stateProvider
      .state('home', {
        url: '/'
      })
  }])
