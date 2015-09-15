"use strict";

var rootCommons = require('commons')

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'angularModalService'
])
rootCommons.setStaticPrefix(app)
app.factory('resetForm', resetForm)

function resetForm() {

  /**
   * Resets an angular form to its pristine and untouched state. Clears all the form controls.
   *
   * @param form - an angular form instance
   * @param el - an angular element which wraps the form i.e the form is a descendant of the element
   * @param controlCssClass - a unique class name for all controls of the form we wish to reset
   */
  function reset(form, el, controlCssClass) {
    el.find('.' + controlCssClass).each(function() {
      $(this).val('')
    })

    //form.$error = {}
    form.$setPristine()
    form.$setUntouched()
  }

  return reset
}

app.controller('CustomerModalCtrl', CustomerModalCtrl)

CustomerModalCtrl.$inject = ['resetForm', '$element', 'close', 'Branch', 'xhrErrorDisplay']

function CustomerModalCtrl(resetForm, element, close, Branch, xhrErrorDisplay) {
  var vm = this
  vm.customer = {}
  vm.close = closeModal
  vm.reset = reset
  vm.addCustomer = addCustomer
  vm.getBranch = getBranch
  vm.createNewBranch = createNewBranch
  vm.revealNewBranchForm = revealNewBranchForm
  vm.dismissNewBranchForm = dismissNewBranchForm

  function closeModal() {
    close()
  }

  function reset(form) {
    vm.customer = {}
    resetForm(form, element, 'form-control')
  }

  function addCustomer(customer) {
    close(customer)
  }

  function getBranch(branchParam) {
    return Branch.query({filter: branchParam}).$promise
  }

  function createNewBranch(newBranch) {
    if (!newBranch) return

    var branch = new Branch(newBranch)
    branch.$save(newBranchedSavedSuccess, newBranchedSavedError)

    function newBranchedSavedSuccess(data){
      vm.customer.branch = data
      dismissNewBranchForm()
    }

    function newBranchedSavedError(xhr){
      xhrErrorDisplay(xhr);
    }
  }

  var $addNewCustomerContainer = element.find('.add-new-customer-container')
  var $addCustomerFormCtrl = element.find('.add-customer-form-control')
  var $newBranchContainer = element.find('.new-branch-form-container')

  function dismissNewBranchForm() {
    $newBranchContainer.hide()
    $addCustomerFormCtrl.show()
    $addNewCustomerContainer.removeClass('ui-widget-overlay ui-front').find('.form-control').each(function() {
      $(this).prop('disabled', false)
    })
  }

  function revealNewBranchForm() {
    $addCustomerFormCtrl.hide()
    $newBranchContainer.show()
    $addNewCustomerContainer.addClass('ui-widget-overlay ui-front').find('.form-control').each(function() {
      $(this).prop('disabled', true)
    })
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
                    minHeight: 450
                  })

                  modal.close.then(function(customer) {
                    if (customer && angular.isObject(customer)) {
                      self.addCustomer(customer)
                    }
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
