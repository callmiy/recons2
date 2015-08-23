"use strict";

/*globals angular*/

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.pre_neg',
  ['ui.router'
  ])

  .config(['$stateProvider', function letterOfCreditPaymentPreNegURLConfig($stateProvider) {
    $stateProvider
      .state('pre_neg', {
        title: 'Deferred Payments - (Pre Negotiation)',

        url: '/deferred-payment',

        templateUrl: paymentCommons.buildUrl('/pre-neg/pre-neg.html')
      })
  }])
