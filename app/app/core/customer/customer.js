"use strict";

var app = angular.module('customer', ['rootApp'])

app.factory('Customer', Customer)
Customer.$inject = ['$resource', 'urls']
function Customer($resource, urls) {
  var url = appendToUrl(urls.customerAPIUrl, ':id')
  return $resource(url, {id: '@id'}, {
      'put': {
        method: 'PUT'
      }
    }
  )
}

app.factory('getTypeAheadCustomer', getTypeAheadCustomer)
getTypeAheadCustomer.$inject = ['Customer']
function getTypeAheadCustomer(Customer) {

  function getCustomer(customerName) {
    return Customer.query({name: customerName}).$promise
  }

  return getCustomer
}


require('./add-customer/add-customer.js')
