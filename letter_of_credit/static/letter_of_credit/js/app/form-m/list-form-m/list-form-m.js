"use strict"

var rootCommons = require('commons')

var app = angular.module('list-form-m',
  ['rootApp',
   'ui.router',
   'form-m-service',
   'form-m-search',
   'form-m-lc-issue',
   'model-table',
   'customer',
   'add-form-m'
  ])

app.config(rootCommons.interpolateProviderConfig)

app.config(formMListURLConfig)
formMListURLConfig.$inject = ['$stateProvider']
function formMListURLConfig($stateProvider) {

  $stateProvider
    .state('form_m.list', {
      kanmiiTitle: 'Form M List',

      views: {
        'listFormM': {
          template: require('./list-form-m.html'),

          controller: 'FormMListController as formMList'
        }
      }
    })
}

app.controller('FormMListController', FormMListController)
FormMListController.$inject = ['FormM', '$scope', 'formMModelManager', '$http', '$state']
function FormMListController(FormM, scope, formMModelManager, $http, $state) {
  var vm = this

  /**
   * The model manager will be used by the 'model-table' directive to manage the collection of form Ms retrieved
   * from the server
   * @type {[]}
   */
  vm.modelManager = formMModelManager

  vm.modelRowDblClick = function modelRowDblClick(formM) {
    $state.go('form_m.add', {detailedFormM: formM})
    scope.tabs.addFormM.active = true
  }

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
  FormM.getNoLcAttached().$promise.then(function(data) {
    updateFormMs(data)
  })

  /**
   * The table caption for the 'model-table' directive
   * @type {string}
   */
  vm.tableCaption = 'Form M (LC Not Established)'

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
