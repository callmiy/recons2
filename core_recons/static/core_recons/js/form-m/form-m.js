"use strict";

/*jshint camelcase:false*/

var app = angular.module('form-m-service', ['rootApp'])

app.factory('FormM', FormM)
FormM.$inject = ['$resource', 'urls']
function FormM($resource, urls) {
  var url = appendToUrl(urls.formMAPIUrl, ':id')
  return $resource(url, {id: '@id'}, {
      put: {
        method: 'PUT'
      },

      getPaginated: {
        method: 'GET'
      },

      getNoLcAttached: {
        method: 'GET',
        params: {lc_not_attached: true}
      }
    }
  )
}

app.factory('formMModelManager', formMModelManager)
formMModelManager.$inject = ['$filter']
function formMModelManager($filter) {
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

app.value('formMAttributesVerboseNames', {
  date_received: 'date received',
  number: 'form m number',
  currency: 'currency',
  applicant: 'applicant'
})
