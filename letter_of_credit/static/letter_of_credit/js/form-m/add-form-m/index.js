"use strict";
/*jshint camelcase:false*/

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
                      self.newFormM = savedFormM
                    }
                  })
                })
              })
    },

    controller: 'AddFormMDirectiveCtrl as addFormM',

    scope: {},

    bindToController: {
      newFormM: '='
    }
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
  'formatDate',
  'kanmiiUnderscore',
  'LCIssueConcrete'
]
function AddFormMModalCtrl(resetForm, element, close, getTypeAheadCustomer, xhrErrorDisplay,
  getTypeAheadCurrency, FormM, formatDate, kanmiiUnderscore, LCIssueConcrete) {

  var vm = this

  vm.element = element

  initForm()
  function initForm() {
    vm.formM = {
      date_received: new Date()
    }

    vm.showLcIssueContainer = false
    vm.addLcIssuesTitle = 'Add Letter Of Credit Issues'
    vm.selectedLcIssues = {}
  }

  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
  function toggleShowLcIssueContainer() {
    vm.showLcIssueContainer = !vm.showLcIssueContainer

    vm.addLcIssuesTitle = !vm.showLcIssueContainer ? 'Add Letter Of Credit Issues' : 'Dismiss'
  }

  vm.close = close

  vm.reset = reset
  function reset(form) {
    vm.formM = {}
    resetForm(form, element, 'form-control', initForm)
  }

  vm.addFormM = addFormM
  function addFormM(newFormM) {
    var formMToSave = angular.copy(newFormM)
    formMToSave.applicant = newFormM.applicant.url
    formMToSave.currency = newFormM.currency.url
    formMToSave.date_received = formatDate(newFormM.date_received)

    var formM = new FormM(formMToSave)
    formM.$save(formMSavedSuccess, formMSavedError)

    function formMSavedSuccess(data) {
      kanmiiUnderscore.each(vm.selectedLcIssues, function(val, key) {
        if (val) {
          new LCIssueConcrete({issue: key, mf: data.url})
            .$save(function(data) { console.log(data); }, function(xhr) {console.log(xhr);})
        }
      })
      close(data)
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, {date_received: 'date received'})
    }
  }

  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency

  vm.datePickerFormat = 'dd-MMMM-yyyy'
  vm.datePickerIsOpen = false
  vm.openDatePicker = openDatePicker
  function openDatePicker() {
    vm.datePickerIsOpen = true
  }
}
