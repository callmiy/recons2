"use strict";

var app = angular.module('pager-nav', ['kanmii-URI'])
app.directive('pagerNav', pagerNav)
function pagerNav() {
  return {
    link: function(scope, element, attributes, self) {
      element.on({
        'click': function(evt) {
          evt.preventDefault()

          var $target = $(evt.target)

          if ($target.is('.active') || $target.closest('li').is('.disabled')) return

          var linkUrl = $target.attr('href') || $target.parent().attr('href')
          self.targetClickedCallback({linkUrl: linkUrl})
        }
      }, '.pager-nav-link')
    },

    scope: {},

    bindToController: {
      /**
       * @param {null|Function} when any of the pager links is clicked, this function will be invoked -
       * it will e.g to the server to get the data at the url represented by the link
       */
      targetClickedCallback: '&',

      /**
       * @param {null|String} The url of the 'previous' link
       */
      prevPageLink: '=',

      /**
       * @param {Array} - an array of URLs that will be used as the href of the pager links
       */
      linkUrls: '=',

      /**
       * @param {null|String} The url of the 'current' link
       */
      currentLink: '=currentPagerLink',

      /**
       * @param {null|String} The url of the 'next' link
       */
      nextPageLink: '='
    },

    controller: 'PagerNavCtrl as pageNav',

    template: require('./pager-nav.html')
  }
}

app.controller('PagerNavCtrl', PagerNavCtrl)
function PagerNavCtrl() {}

app.factory('pagerNavSetUpLinks', pagerNavSetUpLinks)
pagerNavSetUpLinks.$inject = ['kanmiiUri']
function pagerNavSetUpLinks(kanmiiUri) {
  /**
   * The links that will be used to page through a collection of objects (mostly likely retrieved from the server) -
   * we basically set up the models that will make working with the link easy.
   *
   *  We will render the following links
   *  |previous| |link 1| |link 2| ... |link n| |next|
   *
   * @param {string} next - the url for the 'next' link
   * @param {string} prev - the url for the 'prev' link
   * @param {int} numLinks - total number of links that will be rendered - |link 1| |link 2| ... |link n|
   */
  function setUpLinks(next, prev, numLinks) {
    var linkProperties = {
      /**
       * we always start at page 1. If the user is however on a different page, we will modify this property
       * appropriately below
       */
      currentLink: 1
    }

    linkProperties.linkUrls = []

    if (numLinks === 1) return linkProperties //there is absolutely no need to render navigational links

    //NOW there are at least 2 links
    //url for fetching data will be in the format: http:host/pathname[?other optional queries][&page=integer]

    var uri, query, uriWithoutQuery, i

    //if we are on link 1,
    //prev = null (cos we can not go back - there is no position zero)
    //next = url above with query 'page=2'
    if (!prev) {
      uri = kanmiiUri(next)
      query = uri.search(true)
      uriWithoutQuery = uri.search('')

      query.page = 1//query.page was '2'
      linkProperties.linkUrls = [
        uriWithoutQuery.clone().search(query).toString(), next
      ]

      for (i = 3; i <= numLinks; i++) {
        query.page = i
        linkProperties.linkUrls.push(uriWithoutQuery.clone().search(query).toString())
      }

    } else {//we are on any other link except link 1
      uri = kanmiiUri(prev)
      query = uri.search(true)

      if (!query.page) {//if we are on 2nd page, the server will omit the page query from the 'previous' link
        linkProperties.currentLink = 2

      } else {
        linkProperties.currentLink = Number(query.page) + 1//the current link will always be one greater than
                                                           // 'previous' link
      }

      uriWithoutQuery = uri.search('')

      for (i = 1; i <= numLinks; i++) {
        query.page = i
        linkProperties.linkUrls.push(uriWithoutQuery.clone().search(query).toString())
      }
    }

    return linkProperties
  }

  return setUpLinks
}
