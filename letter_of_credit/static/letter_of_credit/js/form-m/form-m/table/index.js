"use strict";

var app = angular.module('form-m-display', ['toggle-bg-color', 'pager-nav'])

app.directive('displayFormM', formMDisplay)
function formMDisplay() {

  return {
    restrict: 'EA',

    controller: 'formMDisplayCtrl as formMTable',

    templateUrl: require('formMCommons').buildUrl('form-m/table/table.html'),

    scope: {},

    bindToController: {
      formMCollection: '=formMCollection',
      newFormM: '='
    }
  }
}

app.controller('formMDisplayCtrl', formMDisplayCtrl)
formMDisplayCtrl.$inject = ['$scope', '$http', 'pagerNavSetUpLinks']
function formMDisplayCtrl(scope, $http, pagerNavSetUpLinks) {
  /*jshint validthis:true*/
  var vm = this

  /**
   * Maximum number of form Ms that can be shown to user.
   * @type {number}
   */
  vm.paginationSize = 20

  vm.orderProp = '-date_received'

  function setUpLinks(next, prev, count) {

    var numLinks = Math.ceil(count / vm.paginationSize)

    var linkProperties = pagerNavSetUpLinks(next, prev, numLinks)

    vm.nextPageLink = next
    vm.prevPageLink = prev

    vm.linkUrls = linkProperties.linkUrls
    vm.currentLink = linkProperties.currentLink
  }

  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
  /**
   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
   * @param {string} linkUrl - the url (href) of the link clicked by user
   */
  function getFormMCollectionOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      vm.formMCollection = response.data
    })
  }

  scope.$watch(function getNewFormM() {return vm.newFormM}, function(newFormM) {
    if (newFormM) {
      vm.formMCollection.results.unshift(newFormM)
      vm.orderProp = '-id'
    }
  })

  scope.$watch(function() {return vm.formMCollection}, function(newFormMs) {
    if (newFormMs) {
      if (newFormMs.$promise) {
        newFormMs.$promise.then(function(data) {
          setUpLinks(data.next, data.previous, data.count)
        })

      } else {
        setUpLinks(newFormMs.next, newFormMs.previous, newFormMs.count)
      }
    }
  })
}
