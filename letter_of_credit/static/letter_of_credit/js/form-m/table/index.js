"use strict";

var app = angular.module('form-m-display', ['kanmii-URI'])

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
formMDisplayCtrl.$inject = ['$scope', 'urls', '$http', 'kanmiiUri']
function formMDisplayCtrl(scope, urls, $http, kanmiiUri) {
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
   * The links that will be used to page through the form Ms retrieved from the server - we basically set up the models
   * that will make working with the link easy.
   *
   * The data from retrieving the form M collection will be an object with the following key:
   * {
   *  next - a url that points to the next collection in the result. Defaults to null if we already have all data
   *  previous - a url that points to the previous data collection defaults to null if this is our first request to
   * server
   * count - total number of data available
   * results - the current collection of form Ms
   * }
   * @param {string} next
   * @param {string} prev
   * @param {int} count
   */
  function setUpLinks(next, prev, count) {

    vm.nextPageLink = next
    vm.prevPageLink = prev

    var numLinks = Math.ceil(count / vm.paginationSize)

    vm.linkUrls = []

    if (numLinks === 1) return //there is absolutely no need to render navigational links

    //NOW there are at least 2 links
    //url for fetching data will be in the format: http:host/pathname?[other optional queries][&]page=integer

    var uri, query, uriWithoutQuery, i

    //if we are on link 1,
    //prev = null (cos we can not go back - there is no position zero)
    //next = url above with query 'page=2'
    if (!prev) {
      vm.currentLink = 1
      uri = kanmiiUri(next)
      query = uri.search(true)
      uriWithoutQuery = uri.search('')

      query.page = 1//query.page was '2'
      vm.linkUrls = [
        uriWithoutQuery.clone().search(query).toString(), next
      ]

      for (i = 3; i <= numLinks; i++) {
        query.page = i
        vm.linkUrls.push(uriWithoutQuery.clone().search(query).toString())
      }

    } else {//we are on any other link except link 1
      uri = kanmiiUri(prev)
      query = uri.search(true)

      if (!query.page) {//if we are on 2nd page, the server will omit the page query from the previous link
        vm.currentLink = 2

      } else {
        vm.currentLink = Number(query.page) + 1//the current link will always be one greater than previous link
      }

      uriWithoutQuery = uri.search('')

      for (i = 1; i <= numLinks; i++) {
        query.page = i
        vm.linkUrls.push(uriWithoutQuery.clone().search(query).toString())
      }
    }
  }

  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
  /**
   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
   * @param {string} linkUrl - please check this directive's link function for the origin of this parameter
   */
  function getFormMCollectionOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      vm.formMCollection = response.data
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
