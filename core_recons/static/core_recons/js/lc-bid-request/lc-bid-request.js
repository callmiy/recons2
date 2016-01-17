"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-bid-request', ['rootApp'])

app.factory('LcBidRequest', LcBidRequest)
LcBidRequest.$inject = ['$resource', 'urls']
function LcBidRequest($resource, urls) {
  var url = appendToUrl(urls.lcBidRequestAPIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      put: {
        method: 'PUT'
      },

      getPaginated: {
        method: 'GET'
      },

      pending: {
        method: 'GET',
        params: {
          pending: true
        }
      }
    }
  )
}

app.factory('lcBidRequestModelManager', lcBidRequestModelManager)
lcBidRequestModelManager.$inject = ['$filter']
function lcBidRequestModelManager($filter) {
  var numberCssStyle = {'text-align': 'right'}

  return [
    {
      title: 'Form M', modelKey: 'form_m_number'
    },

    {
      title: 'Applicant', modelKey: 'applicant'
    },

    {
      title: 'Currency', modelKey: 'currency'
    },

    {
      title: 'Amount', tdStyle: numberCssStyle,
      render: function (model) {
        return $filter('number')(model.amount, 2)
      }
    },

    {
      title: 'Date Created', tdStyle: numberCssStyle,
      render: function (model) {
        return $filter('date')(model.created_at, 'dd-MMM-yyyy')
      }
    },

    {
      title: 'Date Requested', tdStyle: numberCssStyle,
      render: function (model) {
        return $filter('date')(model.requested_at, 'dd-MMM-yyyy')
      }
    }
  ]
}

app.value('bidAttributesVerboseNames', {mf: 'form m', amount: 'amount'})


app.factory('ViewBidDetail', ViewBidDetail)

ViewBidDetail.$inject = ['ModalService', '$q']

function ViewBidDetail(ModalService, $q) {

  function BidDetail() {
    this.showDialog = showDialog

    function showDialog(config) {
      var deferred = $q.defer()

      ModalService.showModal({
        template: require('./view-bid-detail.html'),
        inputs: {config: config},
        controller: 'ViewBidDetailModalCtrl as bidDetail'
      }).then(modalHandler)

      function modalHandler(modal) {
        modal.element.dialog({
          modal: true,
          dialogClass: 'no-close',
          minWidth: 500,
          title: config.title,

          close: function () {modal.controller.close(false)}
        })

        if (!config.infoOnly) modal.close.then(function (answer) {deferred.resolve(answer)})
      }

      return deferred.promise
    }
  }

  return new BidDetail()
}

app.controller('ViewBidDetailModalCtrl', ViewBidDetailModalCtrl)

ViewBidDetailModalCtrl.$inject = ['config', 'close']

function ViewBidDetailModalCtrl(config, close) {
  this.text = config.text
  this.infoOnly = config.infoOnly
  this.close = close
}
