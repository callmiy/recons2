"use strict";

/*globals angular*/

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.post_neg',
  [
    'ui.router'
  ])
  .config(require('commons').interpolateProviderConfig)
  .config(letterOfCreditPaymentPostNegStateConfig)
  .controller('PostNegCtrl', PostNegCtrl)

letterOfCreditPaymentPostNegStateConfig.$inject = ['$stateProvider']

function letterOfCreditPaymentPostNegStateConfig($stateProvider) {
  $stateProvider
    .state('post_neg', {
      data: {
        title: 'ITF - (Post Negotiation Financing)'
      },

      url: '/itf',

      templateUrl: paymentCommons.buildUrl('post-neg/post-neg.html'),

      controller: 'PostNegCtrl as postNeg'
    })
}

function PostNegCtrl() {
  /*jshint validthis:true*/
  var vm = this
  vm.itfDisplayTableCaption = 'ITF Maturity Table'
}

require('./display')
