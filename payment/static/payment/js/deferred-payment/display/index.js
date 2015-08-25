"use strict";

var paymentCommons = require('./../../payment-commons')

angular
  .module('letterOfCreditPayment.deferred_payment')
  .directive('deferredPaymentDisplay', deferredPaymentDisplay)
  .controller('deferredPaymentDisplayCtrl', deferredPaymentDisplayCtrl)

function deferredPaymentDisplay() {
  return {
    restrict: 'E',

    controller: 'deferredPaymentDisplayCtrl as deferredPaymentDisplay',

    templateUrl: paymentCommons.buildUrl('deferred-payment/display/display.html'),

    scope: {},

    bindToController: {
      caption: '=tableCaption'
    }
  }
}

function deferredPaymentDisplayCtrl() {
  /*jshint validthis:true*/
  var vm = this
  vm.css = paymentCommons.buildUrl('deferred-payment/display/display.min.css')
}
