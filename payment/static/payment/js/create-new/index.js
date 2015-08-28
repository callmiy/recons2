"use strict";

var paymentCommons = require('../payment-commons')

var app = angular.module('letterOfCreditPayment.create_new', ['rootApp'])

app.controller('CreateNewPaymentCtrl', CreateNewPaymentCtrl)

app.directive('createNewPayment', createNewPayment)

function createNewPayment() {
  return {
    restrict: 'E',

    bindToController: true,

    templateUrl: paymentCommons.buildUrl('create-new/create-new-payment.html'),

    controller: 'CreateNewPaymentCtrl',

    controllerAs: 'createNewPayment'
  }
}

function CreateNewPaymentCtrl(scope, element) {

}

app.directive('createNewPaymentSearchLc', createNewPaymentSearchLc)

function createNewPaymentSearchLc() {
  return {
    restrict: 'E',

    bindToController: true,

    templateUrl: paymentCommons.buildUrl('create-new/create-new-payment-search.html'),

    controller: 'createNewPaymentSearchLcController as createNewPaymentSearch'
  }
}

app.controller('createNewPaymentSearchLcController', createNewPaymentSearchLcController)

function createNewPaymentSearchLcController(scope, element) {
  var vm = this;
  vm.element = element
}
