"use strict"

var rootCommons = require('commons')

require('./table')
require('./search-form-m')
require('./lc-issue')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'form-m-display',
   'form-m-search',
   'form-m-lc-issue'
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
FormMController.$inject = ['FormM', '$scope']
function FormMController(FormM, scope) {
  var vm = this;

  /**
   * The form Ms retrieved from backend. Will contain a list of form Ms and pagination hooks for
   * retrieving the next and previous sets of form Ms. This model is used by the display directive
   * to display the form Ms in a table
   * @type {object}
   */
  vm.formMs = FormM.getPaginated()

  /**
   * The 'new form M' model. When we create a new form M via the create/add form M directive, the result is
   * propagated from the creation directive into this model
   * @type {null|object}
   */
  vm.newFormM = null

  /**
   * When the search-form-m directive returns, the result is propagated into this model
   * @type {null|object}
   */
  vm.searchedFormMResult = null

  scope.$watch(function getNewFormM() {return vm.searchedFormMResult}, function(searchedFormMResult) {
    if (searchedFormMResult) {
      vm.formMs = searchedFormMResult
    }
  })
}

require('./add-form-m')
