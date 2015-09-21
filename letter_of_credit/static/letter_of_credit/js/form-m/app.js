"use strict";

var rootCommons = require('commons')

var app = angular.module('form-m',
  ['rootApp',
   'ui.router',
   'kanmii-underscore'
  ])

//rootCommons.setStaticPrefix(app)
app.config(rootCommons.interpolateProviderConfig)

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state
  $rootScope.$stateParams = $stateParams
}])

app.config(formMURLConfig)
formMURLConfig.$inject = ['$stateProvider', '$urlRouterProvider']
function formMURLConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',

      controller: 'HomeController as formMHome'
    })
}

app.controller('HomeController', HomeController)
HomeController.$inject = ['FormM', '$scope']
function HomeController(FormM, scope) {
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
   * @type {object}
   */
  vm.newFormM = null

  /**
   *
   */
  scope.$watch(function getNewFormM() {return vm.newFormM}, function(newFormM) {
    if (newFormM) {
      vm.formMs.results.unshift(newFormM)
    }
  })
}

require('./table')
require('./lc-issue')
require('./add-form-m')
require('./search-form-m')
