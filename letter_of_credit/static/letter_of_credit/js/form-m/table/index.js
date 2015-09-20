"use strict";

var formMCommons = require('./../commons')

var app = angular.module('form-m')

app.directive('formMDisplay', formMDisplay)
formMDisplay.$inject = ['urls', '$http']
function formMDisplay(urls, $http) {
  return {
    restrict: 'E',

    controller: 'formMDisplayCtrl as formMTable',

    templateUrl: formMCommons.buildUrl('table/table.html'),

    link: function(scope, element, attributes, self) {
      self.formMLinkUrl = urls.formMAPIUrl
      self.formMs.$promise.then(setUpLinks)

      element.find('.form-m-display-root-container').on({
        'click': function(evt) {
          evt.preventDefault()

          var $target = $(evt.target)

          if ($target.is('.active') || $target.closest('li').is('.disabled')) return

          var linkUrl = $target.attr('href') || $target.parent().attr('href')

          $http.get(linkUrl).then(function(response) {
            var data = response.data
            self.formMs = data
            setUpLinks(data)
          })
        }
      }, '.form-m-pager-nav-link')

      function setUpLinks(serverResponse) {
        var next = serverResponse.next
        var prev = serverResponse.previous

        self.nextPageLink = next
        self.prevPageLink = prev

        self.numLinks = Math.ceil(serverResponse.count / 20)

        var pageRegexp = new RegExp("\\?page=(\\d+)")

        if (!next) self.currentLink = self.numLinks
        else self.currentLink = !prev ? 1 : Number(pageRegexp.exec(prev)[1]) + 1

      }
    },

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

  //vm.css = formMCommons.buildUrl('table/table.min.css')

  scope.$watch(function getFormMs() {return vm.formMs.results}, function formMsChanged() {
    vm.orderProp = '-id'
  })
}
