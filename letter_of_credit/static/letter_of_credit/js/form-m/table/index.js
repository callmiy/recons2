"use strict";

var formMCommons = require('./../commons')

var app = angular.module('form-m')

app.directive('formMDisplay', formMDisplay)
formMDisplay.$inject = ['urls', '$http']
function formMDisplay(urls, $http) {

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
    restrict: 'E',

    controller: 'formMDisplayCtrl as formMTable',

    templateUrl: formMCommons.buildUrl('table/table.html'),

    link: function(scope, element, attributes, self) {
      attachEvent(element)

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

        self.numLinks = Math.ceil(serverResponse.count / self.paginationSize)

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
formMDisplayCtrl.$inject = []
function formMDisplayCtrl() {
  /*jshint validthis:true*/
  var vm = this

  /**
   * Maximum number of form Ms that can be shown to user.
   * @type {number}
   */
  vm.paginationSize = 20

  vm.orderProp = '-date_received'
}
