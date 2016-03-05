/*jshint camelcase:false*/

"use strict";

var app = angular.module( 'lc-cover', [
  'rootApp',
  'add-form-m-form-m-object'
] )

app.directive( 'lcCover', lcIssueDirective )

lcIssueDirective.$inject = []

function lcIssueDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'lcAppCommons' ).buildUrl( 'form-m/add-form-m/lc-cover/lc-cover.html' ),
    scope: true,
    bindToController: {
      formM: '=mfContext',
      cover: '=',
      onCoverChanged: '&'
    },
    controller: 'LcCoverDirectiveController as lcCover'
  }
}

app.controller( 'LcCoverDirectiveController', LcCoverDirectiveController )

LcCoverDirectiveController.$inject = [
  '$scope',
  'formMCoverTypes',
  '$filter',
  'formFieldIsValid',
  'formMObject'
]

function LcCoverDirectiveController($scope, formMCoverTypes, $filter, formFieldIsValid, formMObject) {
  var vm = this
  vm.formM = formMObject
  var title = 'Register Cover'
  init()

  function init(form) {
    vm.title = title
    vm.coverTypes = null
    formMObject.cover = {}

    if ( form ) {
      form.$setPristine()
      form.$setUntouched()
    }
  }

  vm.isValid = function isValid(name, validity) {
    return formFieldIsValid( $scope, 'coverForm', name, validity )
  }

  vm.amountGetterSetter = function (val) {
    if ( arguments.length ) {
      if ( !/[\d,\.]+/.test( val ) ) formMObject.cover.amount = null
      else formMObject.cover.amount = Number( val.replace( /,/g, '' ) )
    } else return formMObject.cover.amount ? $filter( 'number' )( formMObject.cover.amount, 2 ) : ''
  }

  vm.toggleShow = function toggleShow(form) {
    if ( vm.formM.deleted_at ) {
      formMObject.showCoverForm = false
      return
    }

    formMObject.showCoverForm = vm.formM.amount && vm.formM.number && !formMObject.showCoverForm

    if ( !formMObject.showCoverForm ) {
      init( form )
    }
    else {
      vm.title = 'Dismiss'
      vm.coverTypes = formMCoverTypes
      formMObject.cover.amount = vm.formM.amount
    }
  }

  $scope.$watch( function getFormM() {return vm.formM}, function (formM) {
    formMObject.coverForm = $scope.coverForm
    if ( formM ) {
      if ( !formM.amount || !formM.number ) {
        init( formMObject.coverForm )
      }
    }
  }, true )
}
