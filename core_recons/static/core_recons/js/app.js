"use strict";

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'angularModalService'
])

app.factory('resetForm', resetForm)

function resetForm() {

  /**
   * Resets an angular form to its pristine and untouched state. Clears all the form controls.
   *
   * @param form - an angular form instance
   * @param el - an angular element which wraps the form i.e the form is a descendant of the element
   * @param controlClass - a unique class name for all controls of the form we wish to reset
   */
  function reset(form, el, controlClass) {
    el.find('.' + controlClass).each(function() {
      $(this).val('')
    })

    form.$error = {}
    form.$setPristine()
    form.$setUntouched()
  }

  return reset
}

app.controller('CustomerModalCtrl', CustomerModalCtrl)

CustomerModalCtrl.$inject = ['resetForm', '$element', 'close']

function CustomerModalCtrl(resetForm, element, close) {
  var vm = this
  vm.customer = {}
  vm.close = closeModal
  vm.reset = reset
  vm.addCustomer = addCustomer

  function closeModal() {
    console.log('am closing');
  }

  function reset(form) {
    vm.customer = {}
    resetForm(form, element, 'form-control')
  }

  function addCustomer(customer) {
    close(customer)
  }
}

app.controller('AddCustomerDirectiveCtrl', AddCustomerDirectiveCtrl)
AddCustomerDirectiveCtrl.$inject = ['Customer', 'xhrErrorDisplay']
function AddCustomerDirectiveCtrl(Customer, xhrErrorDisplay) {
  var vm = this
  vm.customer = {}
  vm.addCustomer = addCustomer

  function addCustomer(customerObj) {
    var newCustomer = new Customer(customerObj)
    newCustomer.$save(newCustomerSaveSuccess, newCustomerSaveError)

    function newCustomerSaveSuccess(data) {
      console.log(data);
    }

    function newCustomerSaveError(xhr) {
      xhrErrorDisplay(xhr);
    }
  }
}

app.directive('addCustomer', addCustomerDirective)
addCustomerDirective.$inject = ['ModalService']
function addCustomerDirective(ModalService) {
  return {
    restrict: 'A',
    link: function(scope, elm, attributes, self) {
      elm
        .css({cursor: 'pointer'})
        .bind('click', function() {
                ModalService.showModal({
                  template: require('./add-customer.html'),
                  controller: 'CustomerModalCtrl as customerModal'
                }).then(function(modal) {
                  modal.element.dialog({
                    dialogClass: 'no-close',
                    modal: true,
                    minWidth: 600,
                    minHeight: 270
                  })

                  modal.close.then(function(customer) {
                    self.addCustomer(customer);
                  })
                })
              })
    },

    controller: 'AddCustomerDirectiveCtrl as addCustomer',

    scope: {},

    bindToController: true
  }
}

require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/commons.services.js')
require('./search-lc')
