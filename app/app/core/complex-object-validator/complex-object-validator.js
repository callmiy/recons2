"use strict";

var app = angular.module('complex-object-validator', ['rootApp'])


app.directive('validateComplexObject', validateComplexObjectField)
validateComplexObjectField.$inject = ['underscore']
function validateComplexObjectField(underscore) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, elm, attributes, ctrl) {
      ctrl.$validators.complexObjectModel = function () {
        var val = ctrl.$modelValue

        if (!attributes.required && !ctrl.$viewValue) return true
        return underscore.isObject(val) && !underscore.isEmpty(val)
      }
    }
  }
}
