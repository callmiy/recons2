"use strict";

angular.module('letterOfCreditApp', ['rootApp'])
  .config(require('commons').interpolateProviderConfig)
  .config(router)

router.$inject = ['$routeProvider'];

function router($routeProvider) {
  $routeProvider
    .when('/', {
      template: require('./search-lc/search-lc.html'),
      controller: 'LetterOfCreditSearchController',
      controllerAs: 'vm'
    }
  )
    .when('/new', {
      template: require('./new-lc/new-lc.html'),
      controller: 'LetterOfCreditNewController',
      controllerAs: 'newLc'
    }
  )
    .when('/details/:id', {
      template: require('./detail-lc/detail-lc.html'),
      controller: 'LetterOfCreditDetailController',
      controllerAs: 'vm'
    }
  );
}

require('./commons/letter-of-credit-statuses.service.js');
require('./display-lc-table');
require('./new-lc');
require('./search-lc');
require('./detail-lc');
