"use strict";

var rootApp = angular.module('rootApp');
rootApp.directive('toUpper', [function () {
  return {
    require: 'ngModel',
    link: function link($scope, $elm, attrs, model) {
      if (!model) return

      model.$parsers.push(function upperCaseParser(viewValue) {
        return viewValue ? viewValue.toUpperCase() : ''
      })

      $elm.bind('focusout', function () {
        var val = $elm.val()
        if (val) $elm.val(val.toUpperCase())
      })
    },
    restrict: 'A'
  };
}]);
