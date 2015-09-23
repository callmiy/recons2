"use strict";

angular.module('toggle-bg-color', [])
  .directive('toggleBgColor', toggleBgColor)

function toggleBgColor() {
  return {
    link: function(scope, element, attributes) {

      element.on({
        click: function toggleBgColorClickListener() {
          var selectedClassIndicator = attributes.selectedClassIndicator

          var $elm = $(this)

          if ($elm.hasClass(selectedClassIndicator)) {
            $elm.removeClass(selectedClassIndicator)
          } else {
            $elm.addClass(selectedClassIndicator).siblings().removeClass(selectedClassIndicator);
          }
        }
      }, attributes.rowSelector)
    }
  }
}
