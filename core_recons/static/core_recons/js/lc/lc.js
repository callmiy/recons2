"use strict";

/*jshint camelcase:false*/

var app = angular.module('lc-service', ['rootApp'])

app.factory('LetterOfCredit', LetterOfCredit)
LetterOfCredit.$inject = ['$resource', 'urls']
function LetterOfCredit($resource, urls) {
  var url = appendToUrl(urls.letterOfCredit1APIUrl, ':id');
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      },

      getPaginated: {
        method: 'GET'
      }
    }
  )
}

app.factory('LcModelManager', LcModelManager)
LcModelManager.$inject = ['$filter']
function LcModelManager($filter) {
  var numberCssStyle = {'text-align': 'right'}

  return [
    {
      title: 'Form M', modelKey: 'number'
    },

    {
      title: 'Applicant',
      render: function(model) {
        return model.applicant_data.name
      }
    },

    {
      title: 'Currency',
      render: function(model) {
        return model.currency_data.code
      }
    },

    {
      title: 'Amount', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('number')(model.amount, 2)
      }
    },

    {
      title: 'Date Received', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('date')(model.date_received, 'dd-MMM-yyyy')
      }
    },

    {
      title: 'Bid Date', modelKey: 'nothing'
    }
  ]
}

app.value('LcAttributesVerboseNames', {
  date_received: 'date received',
  number: 'form m number'
})
