"use strict";

var angular = require('angular');

angular
  .module('letterOfCreditApp')
  .config(router);

router.$inject = ['$routeProvider'];

function router($routeProvider) {
  $routeProvider
    .when('/', {
      template: require('./controllers/search-lc.html'),
      controller: 'LetterOfCreditSearchController',
      controllerAs: 'vm'
    }
  )
    .when('/new', {
      template: require('./controllers/new-lc.html'),
      controller: 'LetterOfCreditNewController',
      controllerAs: 'newLc'
    }
  )
    .when('/details/:id', {
      template: require('./controllers/detail-lc.html'),
      controller: 'LetterOfCreditDetailController',
      controllerAs: 'vm'
    }
  );
}

require('./services');
require('./directives/displayed-lcees-table.js');
require('./controllers');
