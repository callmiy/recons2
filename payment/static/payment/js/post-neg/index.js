"use strict";

/*globals angular*/

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.post_neg',
  ['ui.router'])

  .config(letterOfCreditPaymentPostNegURLConfig)

letterOfCreditPaymentPostNegURLConfig.$inject = ['$stateProvider']

function letterOfCreditPaymentPostNegURLConfig($stateProvider) {
  $stateProvider
    .state('post_neg', {
      title: 'ITF - (Post Negotiation Financing)',

      url: '/itf',

      templateUrl: paymentCommons.buildUrl('post-neg/post-neg.html')
    })
}
