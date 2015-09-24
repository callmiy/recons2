"use strict";
/*jshint camelcase:false*/

var app = angular.module('form-m')

app.directive('addFormM', addFormMDirective)
addFormMDirective.$inject = ['ModalService']
function addFormMDirective(ModalService) {
  function link(scope, elm, attributes, self) {
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
                  maxHeight: 600,
                  title: 'Add Form M'
                })

                modal.close.then(function(submittedData) {
                  if (submittedData && submittedData.submittedFormM) {
                    self.saveFormM(submittedData)
                  }
                })
              })
            })
  }

  return {
    restrict: 'A',
    link: link,
    controller: 'AddFormMDirectiveCtrl as addFormM',
    scope: {},
    bindToController: {
      onNewMf: '&'
    }
  }
}

app.controller('AddFormMDirectiveCtrl', AddFormMDirectiveCtrl)
AddFormMDirectiveCtrl.$inject = [
  'formatDate',
  'FormM',
  'xhrErrorDisplay',
  'kanmiiUnderscore',
  'LCIssueConcrete',
  'LcBidRequest'
]
function AddFormMDirectiveCtrl(formatDate, FormM, xhrErrorDisplay, kanmiiUnderscore, LCIssueConcrete, LcBidRequest) {
  var vm = this

  vm.saveFormM = saveFormM
  function saveFormM(submittedData) {
    var newFormM = submittedData.submittedFormM
    var formMToSave = angular.copy(newFormM)
    formMToSave.applicant = newFormM.applicant.url
    formMToSave.currency = newFormM.currency.url
    formMToSave.date_received = formatDate(newFormM.date_received)

    var submittedBidRequest = submittedData.submittedBidRequest
    if (submittedBidRequest && !kanmiiUnderscore.isEmpty(submittedBidRequest)) {
      formMToSave.goods_description = submittedData.submittedBidRequest.goods_description
    }

    var formM = new FormM(formMToSave)
    formM.$save(formMSavedSuccess, formMSavedError)

    function formMSavedSuccess(data) {
      saveLcIssues(data.url)

      if (formMToSave.goods_description) makeBidRequest(data.url, submittedBidRequest)

      vm.onNewMf({newFormM: data})
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

  function makeBidRequest(formMUrl, submittedBidRequest) {
    submittedBidRequest.mf = formMUrl
    var bid = new LcBidRequest(submittedBidRequest)
    bid.$save(
      function(data) {console.log('bid saved successfully with data = ', data);},
      function(xhr) {xhrErrorDisplay(xhr)}
    )
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

    vm.showBidContainer = false
    vm.makeBidTitle = 'Make Bid Request'
    vm.bidRequest = {
      amount: null
    }
  }

  vm.toggleShowBidContainer = toggleShowBidContainer
  function toggleShowBidContainer(bidRequestForm) {
    vm.showBidContainer = !vm.showBidContainer

    vm.makeBidTitle = !vm.showBidContainer ? 'Make Bid Request' : 'Dismiss'

    if (!vm.showBidContainer) resetForm(bidRequestForm, element, '.bid-request-form-container .form-control')
    else {
      vm.bidRequest.amount = vm.formM.amount
    }
  }

  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
  function toggleShowLcIssueContainer() {
    vm.showLcIssueContainer = !vm.showLcIssueContainer

    vm.addLcIssuesTitle = !vm.showLcIssueContainer ? 'Add Letter Of Credit Issues' : 'Dismiss'
  }

  vm.disableSubmitBtn = disableSubmitBtn
  function disableSubmitBtn(newFormMModalFormInvalid, bidRequestFormInvalid) {

    if (newFormMModalFormInvalid) return true
    else if (vm.showBidContainer && bidRequestFormInvalid) return true
    return false
  }

  vm.close = close

  vm.reset = reset
  function reset(form) {
    vm.formM = {}
    resetForm(form, element, '.form-control', initForm)
  }

  vm.submitFormM = submitFormM
  function submitFormM(newFormM, bidRequest) {
    close({
      submittedFormM: newFormM,
      submittedBidRequest: bidRequest
    })
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
