"use strict";

var rootApp = angular.module('rootApp');
rootApp.directive('toUpper', [function () {
  function link($scope, $elm, attrs, model) {

    function upperCaseParser(viewValue) {
      return viewValue ? viewValue.toUpperCase() : undefined;
    }

    model.$parsers.push(upperCaseParser);

    $elm.bind('focusout', function () {

      var value;
      value = $elm.val();
      $elm.val(value.toUpperCase());
    });
  }

  return {
    require: 'ngModel',
    link: link,
    restrict: 'A'
  };
}]);
