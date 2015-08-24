"use strict";

/*globals angular*/

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.deferred_payment',
  ['ui.router'])

  .config(['$stateProvider', function letterOfCreditPaymentPreNegURLConfig($stateProvider) {
    $stateProvider
      .state('deferred_payment', {
        data: {
          title: 'Deferred Payments'
        },

        url: '/deferred-payment',

        templateUrl: paymentCommons.buildUrl('/deferred-payment/deferred-payment.html')
      })
  }])
