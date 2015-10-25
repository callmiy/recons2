"use strict";

var app = angular.module('kanmii-form-validators', ['kanmii-underscore'])

app.directive('objectModel', objectModelValidator)

objectModelValidator.$inject = ['kanmiiUnderscore']

function objectModelValidator(kanmiiUnderscore) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$validators.objectModel = function(modelValue, viewValue) {
        console.log('modelValue = ', modelValue);
        console.log('view Value = ', viewValue);

        if (ctrl.$isEmpty(modelValue)) return true

        if (kanmiiUnderscore.isObject(modelValue) && !kanmiiUnderscore.isEmpty(modelValue)) {
          display(elm, viewValue)
          return true

        } else {
          return false
        }
      }
    }
  }

  function makeDisplay(viewValue) {
    var objHolder = $('<div>').css({margin: '5px 0 0 10px'})

    var delObj = $('<span></span>')
      .addClass('glyphicon glyphicon-trash')
      .css({cursor: 'pointer'})
      .click(function() {

             })

    objHolder.append(delObj)
    objHolder.append($('<span>' + viewValue + '</span>').css({'margin-left': '5px'}))

    return objHolder
  }

  function display(elm, viewValue) {

    var objDisplay = makeDisplay(viewValue)

    var parentInputGrp = elm.parents('.input-group')

    if (parentInputGrp.size()) parentInputGrp.after(objDisplay)

    else elm.after(objDisplay)

  }
}
