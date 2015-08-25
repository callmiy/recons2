"use strict";

var paymentCommons = require('./../../payment-commons')

angular
  .module('letterOfCreditPayment.post_neg')
  .directive('postNegTableDisplay', postNegTableDisplay)
  .controller('postNegTableDisplayCtrl', postNegTableDisplayCtrl)

function postNegTableDisplay() {
  return {
    restrict: 'E',

    controller: 'postNegTableDisplayCtrl as itfDisplay',

    templateUrl: paymentCommons.buildUrl('post-neg/display/display.html'),

    scope: {},

    bindToController: {
      caption: '=tableCaption'
    }
  }
}

function postNegTableDisplayCtrl() {
  /*jshint validthis:true*/
  var vm = this
  vm.css = paymentCommons.buildUrl('post-neg/display/display.min.css')
}
