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
formMDisplayCtrl.$inject = ['$scope', 'urls']
function formMDisplayCtrl(scope, urls) {
  /*jshint validthis:true*/

  var vm = this

  //vm.css = formMCommons.buildUrl('table/table.min.css')

  vm.formMs.$promise.then(function setUpLinks(data) {
    vm.formMLinkUrl = urls.formMAPIUrl

    var next = data.next
    var prev = data.previous

    vm.nextPageLink = next
    vm.prevPageLink = prev

    vm.currentLink = !prev ? 1 : Number(/\?page=(\d+)/.exec(prev)[1]) + 1

    vm.numLinks = Math.ceil(data.count / 20)
  })

  scope.$watch(function getFormMs() {return vm.formMs}, function formMsChanged() {
    vm.orderProp = '-id'
  })
}
