"use strict";

var app = angular.module('form-m-display', [])

app.directive('displayFormM', formMDisplay)
//formMDisplay.$inject = []
function formMDisplay() {

  function attachEvent(elm) {

    /**
     * toggle the background color of a html table row. Essentially, when a table row is clicked, its color is
     * changed (highlighted) to visually distinguish it from other rows. When the row is clicked again, the color
     * is reset.
     //* @param evt
     */

    function toggleBg(evt) {
      /* jshint validthis: true */

      evt.stopPropagation();

      var selectedClassIndicator = 'form-m-display-table-selected'

      var $elm = $(this)

      $elm = $elm.parents('tr')

      if ($elm.hasClass(selectedClassIndicator)) {
        $elm.removeClass(selectedClassIndicator)
      } else {
        $elm.addClass(selectedClassIndicator).siblings().removeClass(selectedClassIndicator);
      }
    }

    elm.find('tbody').on({
      click: toggleBg
    }, 'td')
  }

  return {
    restrict: 'EA',

    controller: 'formMDisplayCtrl as formMTable',

    template: require('./table.html'),

    link: function(scope, element, attributes, self) {
      attachEvent(element)

      element.find('.form-m-display-root-container').on({
        'click': function(evt) {
          evt.preventDefault()

          var $target = $(evt.target)

          if ($target.is('.active') || $target.closest('li').is('.disabled')) return

          var linkUrl = $target.attr('href') || $target.parent().attr('href')
          self.getFormMCollectionOnNavigation(linkUrl)
        }
      }, '.form-m-pager-nav-link')
    },

    scope: {},

    bindToController: {
      formMCollection: '=formMCollection',
      newFormM: '='
    }
  }
}

app.controller('formMDisplayCtrl', formMDisplayCtrl)
formMDisplayCtrl.$inject = ['$scope', 'urls', '$http']
//TODO: where is this controller (plus this directive's link function) being called twice?
function formMDisplayCtrl(scope, urls, $http) {
  /*jshint validthis:true*/
  var vm = this

  /**
   * Maximum number of form Ms that can be shown to user.
   * @type {number}
   */
  vm.paginationSize = 20

  vm.orderProp = '-date_received'

  vm.setUpLinks = setUpLinks
  /**
   * The links that will be used to page through the form Ms retrieved from the server - we basic set up the models
   * that will make working with the link easy.
   *
   * The data from retrieveing the form M collection will be an object with the following key:
   * {
   *  next - a url that points to the next collection in the result. Defaults to null if we already have all data
   *  previous - a url that points to the previous data collection
   *  count - total number of data available
   *  results - the current collection of form Ms
   * }
   * @param {string} next
   * @param {string} prev
   * @param {int} count
   */
  function setUpLinks(next, prev, count) {

    vm.nextPageLink = next
    vm.prevPageLink = prev

    var numLinks = Math.ceil(count / vm.paginationSize)

    //url for fetching data will be in the format: http:host/pathname?{other optional queries}page=integer
    //the integer part is our current position in the navigation
    var pageRegexp = new RegExp("page=(\\d+)")
    var pageExec = pageRegexp.exec(prev)

    if (!next) vm.currentLink = numLinks
    else if (!prev) vm.currentLink = 1
    else {
      vm.currentLink = !pageExec ? 2 : Number(pageExec[1]) + 1
    }

    var fullUrl = next || prev
    vm.linkUrls = []

    console.log('next = ', next);
    console.log('prev = ', prev);
    console.log('pageExec = ', pageExec);

    if (fullUrl) {
      for (var pageNumber = 1; pageNumber <= numLinks; pageNumber++) {
        var replacedUrl = fullUrl.replace(pageRegexp, 'page=' + pageNumber)
        vm.linkUrls.push(replacedUrl)
      }
    }

    console.log(vm.linkUrls);
  }

  vm.formMLinkUrl = urls.formMAPIUrl

  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
  /**
   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
   * @param {string} linkUrl - please check this directive's link function for the origin of this parameter
   */
  function getFormMCollectionOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      var data = response.data
      vm.formMCollection = data
    })
  }

  scope.$watch(function getNewFormM() {return vm.newFormM}, function(newFormM) {
    if (newFormM) {
      if (vm.formMCollection.results.length === vm.paginationSize) vm.formMCollection.results.pop()
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
