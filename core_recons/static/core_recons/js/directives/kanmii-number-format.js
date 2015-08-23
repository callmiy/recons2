/*JSHint config*/
/*global angular*/

(function () {
  "use strict";

  var numberFormat;

  numberFormat = angular.module('kanmii.numberFormatDirective', []);

  numberFormat.directive('numberFormat', ['$filter', function ($filter) {

    function link($scope, $elm, attrs, ngModelCtrl) {

      // called when model is updated directly on the scope
      function render() {
        $elm.val( $filter('number')(ngModelCtrl.$viewValue, 2) );
      }
      ngModelCtrl.$render = render;

      // called when the model is updated in the input box
      function numberParser(viewValue) {
        return viewValue ? Number(viewValue.replace(/,/g, '')) : undefined;
      }
      ngModelCtrl.$parsers.push(numberParser);

      //called on focusout event
      function valueChangeListener() {
        var value, filteredVal;
        value = $elm.val();

        if (!value) {
          return;
        }

        value = $elm.val().replace(/,/g, '');
        filteredVal = $filter('number')(value, 2);
        $elm.val( filteredVal );
      }
      $elm.bind('focusout', valueChangeListener);

      function keypressListener(event) {
        var key;
        key = event.which;

        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key === 0 || key === 8 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
          return;
        }
        // ignore all other keys which we do not need
        if ( String.fromCharCode(key) !== ',' &&
             String.fromCharCode(key) !== '.' &&
             !(48 <= key && key <= 57) ){
          return;
        }
      } // end function keypressedListener(event)
      $elm.bind('keypress', keypressListener);
    }

    return {require: 'ngModel', link: link, restrict: 'A'};
  }]);
})();
