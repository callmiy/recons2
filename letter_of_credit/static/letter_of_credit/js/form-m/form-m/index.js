"use strict"

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'form-m-search',
   'form-m-lc-issue',
   'model-table'
  ])

app.config(rootCommons.interpolateProviderConfig)

app.config(formMURLConfig)
formMURLConfig.$inject = ['$stateProvider']
function formMURLConfig($stateProvider) {

  $stateProvider
    .state('form-m', {
      url: '/form-m',

      template: require('./index.html'),

      controller: 'FormMController as formMHome'
    })
}

app.controller('FormMController', FormMController)
FormMController.$inject = ['FormM', '$scope', '$filter', '$http']
function FormMController(FormM, scope, $filter, $http) {
  var vm = this;

  var numberCssStyle = {'text-align': 'right'}

  /**
   * The model manager will be used by the 'model-table' directive to manage the collection of form Ms retrieved
   * from the server
   * @type {[]}
   */
  vm.modelManager = [
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

  /**
   * Update the form Ms collection and pagination hooks
   * @param {object} data
   */
  function updateFormMs(data) {
    vm.formMs = data.results

    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
  }

  /**
   * The object containing the hooks for paging through the form Ms collection
   * @type {Array}
   */
  vm.paginationHooks = []

  /**
   * The form Ms retrieved from backend. Will contain a list of form Ms and pagination hooks for
   * retrieving the next and previous sets of form Ms. This model is used by the display directive
   * to display the form Ms in a table
   * @type {[]}
   */
  vm.formMs = []
  FormM.getPaginated().$promise.then(function(data) {
    updateFormMs(data)
  })

  /**
   * The 'new form M' model. When we create a new form M via the create/add form M directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */
  vm.newFormM = null

  vm.receiveNewFormM = receiveNewFormM
  function receiveNewFormM(newFormM) {
    if (newFormM) vm.formMs.unshift(newFormM)
  }

  /**
   * The table caption for the 'model-table' directive
   * @type {string}
   */
  vm.tableCaption = 'Form Ms'

  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
  /**
   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
   * @param {string} linkUrl - the url (href) of the link clicked by user
   */
  function getFormMCollectionOnNavigation(linkUrl) {
    $http.get(linkUrl).then(function(response) {
      updateFormMs(response.data)
    })
  }

  /**
   * When the search-form-m directive returns, the result is propagated into this model
   * @type {null|object}
   */
  vm.searchedFormMResult = null

  scope.$watch(function getNewFormM() {return vm.searchedFormMResult}, function(searchedFormMResult) {
    if (searchedFormMResult) updateFormMs(searchedFormMResult)
  })
}

require('./add-form-m')
