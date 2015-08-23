"use strict";

/*globals angular*/

var paymentCommons = require('../payment-commons')

angular.module('letterOfCreditPayment.post_neg',
  [
    'ui.router'
  ])
  .config(require('commons').interpolateProviderConfig)
  .config(letterOfCreditPaymentPostNegURLConfig)
  .controller('itfMaturesInTwoWeeksCtrl', itfMaturesInTwoWeeksCtrl)

letterOfCreditPaymentPostNegURLConfig.$inject = ['$stateProvider']

function letterOfCreditPaymentPostNegURLConfig($stateProvider) {
  $stateProvider
    .state('post_neg', {
      title: 'ITF - (Post Negotiation Financing)',

      url: '/itf',

      templateUrl: paymentCommons.buildUrl('post-neg/post-neg.html'),

      controller: 'itfMaturesInTwoWeeksCtrl as itfMaturesSoon'
    })

    .state('post_neg.matures_in_two_weeks', {

      template: ''
    })
}

function itfMaturesInTwoWeeksCtrl() {
  var vm = this
  vm.itfDisplayTableCaption = 'ITF Maturing In Next Two Weeks'
}

require('./table-display')
