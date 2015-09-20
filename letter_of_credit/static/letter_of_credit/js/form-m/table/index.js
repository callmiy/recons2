"use strict";

var formMCommons = require('./../commons')

var app = angular.module('form-m')

app.directive('formMDisplay', formMDisplay)
function formMDisplay() {
  return {
    restrict: 'E',

    controller: 'formMDisplayCtrl as formMTable',

    templateUrl: formMCommons.buildUrl('table/table.html'),

    scope: {},

    bindToController: {
      formMs: '=formM',
      newFormM: '='
    }
  }
}

app.controller('formMDisplayCtrl', formMDisplayCtrl)
formMDisplayCtrl.$inject = ['$scope']
function formMDisplayCtrl(scope) {
  /*jshint validthis:true*/
  var vm = this
  vm.css = formMCommons.buildUrl('table/table.min.css')

  scope.$watch(function getFormMs() {return vm.formMs}, function formMsChanged() {
    vm.orderProp = '-id'
  })
}
