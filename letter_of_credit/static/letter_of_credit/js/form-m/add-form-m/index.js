"use strict";

var formMCommons = require('./../commons')

var app = angular.module('form-m')

app.directive('addFormM', addFormMDirective)
addFormMDirective.$inject = ['ModalService']
function addFormMDirective(ModalService) {
  return {
    restrict: 'A',

    link: function(scope, elm, attributes, self) {
      elm
        .css({cursor: 'pointer'})
        .bind('click', function() {
                ModalService.showModal({
                  template: require('./add-form-m.html'),
                  controller: 'AddFormMModalCtrl as addFormMModal'
                }).then(function(modal) {
                  modal.element.dialog({
                    dialogClass: 'no-close',
                    modal: true,
                    minWidth: 600,
                    minHeight: 450
                  })

                  modal.close.then(function(savedFormM) {
                    if (savedFormM && angular.isObject(savedFormM)) {
                      console.log(savedFormM);
                    }
                  })
                })
              })
    },

    controller: 'AddFormMDirectiveCtrl as addFormM',

    scope: {},

    bindToController: true
  }
}

app.controller('AddFormMDirectiveCtrl', AddFormMDirectiveCtrl)
AddFormMDirectiveCtrl.$inject = []
function AddFormMDirectiveCtrl() {
}

app.controller('AddFormMModalCtrl', AddFormMModalCtrl)
AddFormMModalCtrl.$inject = [
  'resetForm',
  '$element',
  'close',
  'getTypeAheadCustomer',
  'xhrErrorDisplay',
  'getTypeAheadCurrency',
  'FormM',
  'formatDate'
]
function AddFormMModalCtrl(resetForm, element, close, getTypeAheadCustomer, xhrErrorDisplay,
  getTypeAheadCurrency, FormM, formatDate) {

  var vm = this

  vm.element = element

  function initForm() {
    vm.formM = {
      date_received: new Date()
    }
  }

  initForm()

  vm.close = close

  vm.reset = reset
  function reset(form) {
    vm.formM = {}
    resetForm(form, element, 'form-control', initForm)
  }

  vm.addFormM = addFormM
  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency

  vm.datePickerFormat = 'dd-MMMM-yyyy'
  vm.datePickerIsOpen = false
  vm.openDatePicker = openDatePicker
  function openDatePicker() {
    vm.datePickerIsOpen = true
  }

  function addFormM(newFormM) {
    var formMToSave = angular.copy(newFormM)
    formMToSave.applicant = newFormM.applicant.url
    formMToSave.currency = newFormM.currency.url
    formMToSave.date_received = formatDate(newFormM.date_received)

    var formM = new FormM(formMToSave)
    formM.$save(formMSavedSuccess, formMSavedError)

    var savedFormM
    function formMSavedSuccess(data) {
      savedFormM = data
      close(savedFormM)
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, {date_received: 'date received'})
    }
  }
}
