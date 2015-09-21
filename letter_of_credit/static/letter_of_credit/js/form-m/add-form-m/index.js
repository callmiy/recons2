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
                    minHeight: 450,
                    title: 'Add Form M'
                  })

                  modal.close.then(function(submittedFormM) {
                    if (submittedFormM) self.saveFormM(submittedFormM)
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
AddFormMDirectiveCtrl.$inject = ['formatDate', 'FormM', 'xhrErrorDisplay', 'kanmiiUnderscore', 'LCIssueConcrete']
function AddFormMDirectiveCtrl(formatDate, FormM, xhrErrorDisplay, kanmiiUnderscore, LCIssueConcrete) {
  var vm = this

  vm.saveFormM = saveFormM
  function saveFormM(newFormM) {
    var formMToSave = angular.copy(newFormM)
    formMToSave.applicant = newFormM.applicant.url
    formMToSave.currency = newFormM.currency.url
    formMToSave.date_received = formatDate(newFormM.date_received)

    var formM = new FormM(formMToSave)
    formM.$save(formMSavedSuccess, formMSavedError)

    function formMSavedSuccess(data) {
      saveLcIssues(data.url)
      vm.newFormM = data
    }

    function formMSavedError(xhr) {
      xhrErrorDisplay(xhr, {date_received: 'date received', number: 'form m number'})
    }
  }

  function saveLcIssues(formMUrl) {
    kanmiiUnderscore.each(vm.selectedLcIssues, function(val, key) {
      if (val) {
        new LCIssueConcrete({issue: key, mf: formMUrl})
          .$save(function(data) { console.log(data); }, function(xhr) {console.log(xhr);})
      }
    })
  }
}

app.controller('AddFormMModalCtrl', AddFormMModalCtrl)
AddFormMModalCtrl.$inject = [
  'resetForm',
  '$element',
  'close',
  'getTypeAheadCustomer',
  'getTypeAheadCurrency'
]
function AddFormMModalCtrl(resetForm, element, close, getTypeAheadCustomer, getTypeAheadCurrency) {

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

  vm.submitFormM = submitFormM
  function submitFormM(newFormM) {
    close(newFormM)
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
