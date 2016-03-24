"use strict";

/*jshint camelcase:false*/

require( './form-m-object.js' )
require( './lc-issue/lc-issue.js' )
require( './lc-cover/lc-cover.js' )
require( './lc-bid/lc-bid.js' )
require( './comment/comment.js' )
require( './attachment/attachment-form-m.js' )

var app = angular.module( 'add-form-m', [
  'ui.router',
  'rootApp',
  'customer',
  'search-detailed-or-uploaded-form-m',
  'form-m-service',
  'lc-cover',
  'lc-issue',
  'lc-bid',
  'form-m-comment',
  'lc-bid-request',
  'confirmation-dialog',
  'add-form-m-form-m-object',
  'lc-service',
  'complex-object-validator',
  'display-uploaded-form-m',
  'form-m-attachment',
] )

app.config( formMStateConfig )

formMStateConfig.$inject = ['$stateProvider']

function formMStateConfig($stateProvider) {
  $stateProvider
    .state( 'form_m.add', {
      kanmiiTitle: 'Add form M',

      params: { showSummary: null, formM: null },

      views: {
        addFormM: {
          templateUrl: require( 'lcAppCommons' ).buildUrl( 'form-m/add-form-m/add-form-m.html' ),

          controller: 'AddFormMStateController as addFormMState'
        }
      }
    } )
}

app.controller( 'AddFormMStateController', AddFormMStateController )

AddFormMStateController.$inject = [
  'getTypeAheadCustomer',
  'getTypeAheadCurrency',
  'SearchDetailedOrUploadedFormMService',
  'underscore',
  'xhrErrorDisplay',
  '$stateParams',
  'resetForm2',
  '$state',
  '$scope',
  'confirmationDialog',
  'formMObject',
  'formMAttributesVerboseNames',
  'getTypeAheadLetterOfCredit',
  'DisplayUploadedFormMModal',
]

function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
  underscore, xhrErrorDisplay, $stateParams, resetForm2, $state, $scope, confirmationDialog, formMObject,
  formMAttributesVerboseNames, getTypeAheadLetterOfCredit, DisplayUploadedFormMModal) {
  var vm = this

  function initFormMCb(formM, detailedFormM) {
    $stateParams.formM = null
    vm.formM = formM
    vm.formM.lcRef = { lc_number: null }
    vm.detailedFormM = detailedFormM

    if ( detailedFormM ) {
      vm.fieldIsEditable = {
        number: false,
        currency: false,
        applicant: false,
        date_received: false,
        amount: false,
        lcRef: false
      }
    }

    $scope.updateAddFormMTitle( detailedFormM )
    formMSavedSuccessMessage()
  }

  initialize()
  function initialize(form, formMNumber) {

    if ( form ) {
      var elements = ['applicant', 'currency'].concat( $scope.newFormMForm.lcRef ? ['lcRef'] : [] )
      resetForm2( form, [{ form: $scope.newFormMForm, elements: elements }] )
      form.$setPristine()
      form.$setUntouched()
    }

    vm.detailedFormM = null
    vm.fieldIsEditable = {
      number: true,
      currency: true,
      applicant: true,
      date_received: true,
      amount: true,
      lcRef: true
    }
    formMObject.init( formMNumber || $stateParams.formM, initFormMCb )
    vm.searchFormM = {}
    vm.action = '';
  }

  vm.reset = initialize

  function formMSavedSuccessMessage() {
    var summary = $stateParams.showSummary
    $stateParams.showSummary = null

    if ( summary ) {
      confirmationDialog.showDialog( {
        title: '"' + vm.formM.number + '" successfully saved',
        text: summary,
        infoOnly: true
      } )
    }
  }

  vm.enableFieldEdit = function enableFieldEdit(field) {
    vm.fieldIsEditable[field] = vm.detailedFormM ? !vm.fieldIsEditable[field] : true
  }

  vm.disableSubmitBtn = function disableSubmitBtn() {
    if ( $scope.newFormMForm.$invalid ) return true

    if ( underscore.has( vm.formM.coverForm, '$invalid' ) && vm.formM.coverForm.$invalid ) return true

    if ( underscore.has( vm.formM.bidForm, '$invalid' ) && vm.formM.bidForm.$invalid ) return true

    if ( underscore.has( vm.formM.issuesForm, '$invalid' ) && vm.formM.issuesForm.$invalid ) return true

    if ( underscore.has( vm.formM.commentForm, '$invalid' ) && vm.formM.commentForm.$invalid ) return true

    if ( formMObject.showEditBid || formMObject.showCommentForm ) return true

    var compared = formMObject.compareFormMs( vm.detailedFormM )

    if ( !compared ) return false

    if ( underscore.all( compared ) ) {
      if ( formMObject.bid.goods_description && formMObject.bid.amount ) return false
      if ( !underscore.isEmpty( vm.formM.cover ) ) return false
      if ( vm.formM.lcRef.lc_number ) return false
      return !vm.formM.selectedIssues.length
    }

    return false
  }

  vm.getLc = function (lcRef) {
    return getTypeAheadLetterOfCredit( { lc_number: lcRef.trim(), mf: vm.formM.number } )
  }
  vm.getApplicant = getTypeAheadCustomer
  vm.getCurrency = getTypeAheadCurrency
  vm.datePickerFormat = 'dd-MMM-yyyy'
  vm.datePickerIsOpen = false
  vm.openDatePicker = function openDatePicker() {
    vm.datePickerIsOpen = true
  }

  vm.getUploadedFormM = function getUploadedFormM() {
    vm.detailedFormM = null
    initialize()

    SearchDetailedOrUploadedFormMService.searchWithModal().then( function (data) {
      if ( data.number ) {
        initialize( null, data.number )

      } else {
        DisplayUploadedFormMModal.display( data.singleWinFormMs ).then( function (formM) {
          if ( formM ) {
            vm.searchFormM = formM
            vm.formM.number = formM.mf
            vm.formM.amount = formM.cost_freight
            vm.formM.goods_description = formM.goods_description

            getTypeAheadCurrency( formM.ccy ).then( function (ccy) {
              vm.formM.currency = ccy[0]
            } )
          }
        } )
      }
    } )
  }

  function saveFormMError(xhr) { xhrErrorDisplay( xhr, formMAttributesVerboseNames ) }

  vm.submit = function submit(formM) {
    formMObject.saveFormM( formM, vm.detailedFormM ).then( function saveFormMSuccess(data) {
      $state.go( 'form_m.add', data )

    }, saveFormMError )
  }

  vm.doAction = function doAction(action, formM) {

    switch (action) {
      case 'cancel':
      case 'reinstate':
        cancelOrReinstate( formM, action )
        break

      default:
        console.log( 'default' )
    }
  }

  /**
   * Cancel for reinstate a form M
   * @param {{}} formM - the form M to cancel or reinstate
   * @param {string} action - the action to take, whether cancel or reinstate - defaults to cancel
   */
  function cancelOrReinstate(formM, action) {
    var title = 'Cancel Form M "' + formM.number + '"'
    var text = 'Are you sure you want to cancel "' + formM.number + '"?'
    var deletedAt = new Date()

    if ( action === 'reinstate' ) {
      title = 'Reinstate Form M "' + formM.number + '"'
      text = 'Are you sure you want to reinstate "' + formM.number + '"?'
      deletedAt = null
    }

    confirmationDialog.showDialog( { title: title, text: text, } ).then( function (answer) {
      if ( answer ) {
        formM.deleted_at = deletedAt
        formMObject.saveFormM( formM, vm.detailedFormM ).then( function saveFormMSuccess(data) {
          $state.go( 'form_m.add', { formM: data.formM } )

        }, saveFormMError )
      }
    } )
  }
}
