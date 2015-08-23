/**
 * Created by maneptha on 21-Oct-14.
 */

/*JSHint config*/
/*global angular*/

(function () {
  "use strict";

  var toUpper;

  toUpper = angular.module('kanmii.toUpperDirective', []);
  toUpper.directive('toUpper', [function () {
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

})();
