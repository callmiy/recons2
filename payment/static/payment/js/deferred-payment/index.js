"use strict";

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.deferred_payment',
  ['ui.router'])

  .controller('DeferredPaymentDisplayCtrl', DeferredPaymentDisplayCtrl)

  .config(['$stateProvider', function letterOfCreditDeferredPaymentStateConfig($stateProvider) {
    $stateProvider
      .state('deferred_payment', {
        data: {
          title: 'Deferred Payments'
        },

        abstract: true,

        url: '/deferred-payment',

        templateUrl: paymentCommons.buildUrl('/deferred-payment/deferred-payment.html')
      })

    $stateProvider.state('deferred_payment.display', {
      url: '',

      templateUrl: paymentCommons.buildUrl('/deferred-payment/deferred-payment.display.html'),

      controller: 'DeferredPaymentDisplayCtrl as defPayDisplay'
    })

    $stateProvider.state('deferred_payment.new', {
      url: '/new'
    })
  }])

function DeferredPaymentDisplayCtrl() {
  var vm = this
  vm.tableCaption = 'Deferred Payment Maturity Profile (Outstanding)'
}

require('./table')
