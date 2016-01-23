"use strict";

/*jshint camelcase:false*/

var app = angular.module('upload-form-m-service', ['rootApp'])

app.factory('UploadFormM', UploadFormM)
UploadFormM.$inject = ['$resource', 'urls']
function UploadFormM($resource, urls) {
  var url = appendToUrl(urls.uploadedFormMAPIUrl, ':id');
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

app.factory('uploadedFormMModelManager', uploadedFormMModelManager)
uploadedFormMModelManager.$inject = ['$filter']
function uploadedFormMModelManager($filter) {
  var numberCssStyle = {'text-align': 'right'}

  return [
    {
      title: 'MF', modelKey: 'mf'
    },

    {
      title: 'BA', modelKey: 'ba'
    },

    {
      title: 'Ccy', modelKey: 'ccy'
    },

    {
      title: 'CFR', tdStyle: numberCssStyle,
      render: function(model) {
        return $filter('number')(model.cost_freight, 2)
      }
    },

    {
      title: 'Applicant', modelKey: 'applicant'
    },

    {
      title: 'Validity', modelKey: 'validity_type'
    },

    {
      title: 'Status', modelKey: 'status'
    }
  ]
}
