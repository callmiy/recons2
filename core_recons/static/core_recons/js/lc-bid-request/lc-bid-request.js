"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'lc-bid-request', ['rootApp'] )

app.factory( 'LcBidRequest', LcBidRequest )
LcBidRequest.$inject = ['$resource', 'urls']
function LcBidRequest($resource, urls) {
  var url = appendToUrl( urls.lcBidRequestAPIUrl, ':id' );
  return $resource( url, { id: '@id' }, {
      put: {
        method: 'PUT'
      },

      patch: {
        method: 'PATCH'
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

app.factory( 'lcBidRequestModelManager', lcBidRequestModelManager )
lcBidRequestModelManager.$inject = ['$filter']
function lcBidRequestModelManager($filter) {
  var numberCssStyle = { 'text-align': 'right' }

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
        return $filter( 'number' )( model.amount, 2 )
      }
    },

    {
      title: 'Date Created', tdStyle: numberCssStyle,
      render: function (model) {
        return $filter( 'date' )( model.created_at, 'dd-MMM-yyyy' )
      }
    },

    {
      title: 'Date Requested', tdStyle: numberCssStyle,
      render: function (model) {
        return $filter( 'date' )( model.requested_at, 'dd-MMM-yyyy' )
      }
    }
  ]
}

app.value( 'bidAttributesVerboseNames', { mf: 'form m', amount: 'amount' } )


app.factory( 'ViewBidDetail', ViewBidDetail )

ViewBidDetail.$inject = ['ModalService', '$filter']

function ViewBidDetail(ModalService, $filter) {

  function BidDetail() {
    this.showDialog = showDialog

    function showDialog(config) {
      ModalService.showModal( {
        template: require( './view-bid-detail.html' ),
        inputs: { config: config },
        controller: 'ViewBidDetailModalCtrl as bidDetail'
      } ).then( modalHandler )

      function modalHandler(modal) {
        var bid = modal.controller.bid
        var title = 'Bid Detail: ' + bid.form_m_number + ' ' + bid.currency + ' ' + $filter( 'number' )( bid.amount, 2 )

        modal.element.dialog( {
          modal: true,
          dialogClass: 'no-close',
          minWidth: 720,
          height: 500,
          title: title,

          close: function () {modal.controller.close()}
        } )
      }
    }
  }

  return new BidDetail()
}

app.controller( 'ViewBidDetailModalCtrl', ViewBidDetailModalCtrl )

ViewBidDetailModalCtrl.$inject = ['config', 'close']

function ViewBidDetailModalCtrl(config, close) {
  this.bid = config.bid
  this.close = close
}
