"use strict";

var rootCommons = require('commons')

angular.module('kanmii-underscore', []).factory('kanmiiUnderscore', function () { return window._ })

angular.module('kanmii-URI', []).factory('kanmiiUri', function () { return window.URI })

var app = angular.module('rootApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngResource',
  'ngAnimate',
  'ngMessages',
  'angularModalService',
  'toggle-dim-element'
])
rootCommons.setStaticPrefix(app)

app.factory('moment', function () { return require('moment') })
app.factory('underscore', function () { return require('underscore') })

app.factory('resetForm', resetForm)
function resetForm() {

  /**
   * Resets an angular form to its pristine and untouched state. Clears all the form controls.
   *
   * @param form - an angular form instance
   * @param el - an angular element which wraps the form i.e the form is a descendant of the element
   * @param selector
   * @param cb - optional callback
   */
  function reset(form, el, selector, cb) {
    el.find(selector).each(function () {
      $(this).val('')
    })

    //form.$error = {}
    form.$setPristine()
    form.$setUntouched()

    cb ? cb() : angular.noop() //jshint -W030
  }

  return reset
}

app.factory('clearFormField', clearFormField)
function clearFormField() {
  /**
   * this is a hack required to clear form controls where ng-model is a complex object and the control did not validate.
   */
  return function (form, fieldName) {
    var field = form[fieldName]
    field.$$lastCommittedViewValue = ''
    field.$rollbackViewValue()
    field.$setPristine()
    field.$setUntouched()
  }
}

app.factory('resetForm2', resetForm2)
resetForm2.$inject = ['clearFormField']
function resetForm2(clearFormField) {

  /**
   *
   * @param {angular.form} form - the global form (may contain children ng-forms)
   * @param {null|[]} clearForm - if present, it is an array of objects of the form:
   * {form: angular.form, elements: []} where elements are the form control elements of the 'form' key
   */
  function reset(form, clearForm) {
    form.$setPristine()
    form.$setUntouched()

    if (clearForm) {
      clearForm.forEach(function (obj) {
        var theForm = obj.form
        obj.elements.forEach(function (element) {
          clearFormField(theForm, element)
        })
      })
    }
  }

  return reset
}

app.factory('formFieldIsValid', formFieldIsValid)
function formFieldIsValid() {
  /**
   * A function whose return value is used to evaluate whether a form control element has error or success
   * @param {string} formName the name of the form
   * @param {string} formControl the name of a form control
   * @param {string|null} validity the type of validity to check for, 'ok' means valid while undefined means invalid
   * @returns {boolean}
   */

  return function ($scope, formName, formControl, validity) {
    var field = $scope[formName][formControl]
    return field.$dirty && field[validity === 'ok' ? '$valid' : '$invalid']
  }
}

app.directive('controlHasFeedback', controlHasFeedback)

function controlHasFeedback() {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      element.addClass('has-feedback')
      var $input = element.find(attributes.controlSelector || '.form-control')
      var $beforeFeedback = element.find(attributes.feedbackAfter)
      var $fieldBack = $('<i class="form-control-feedback glyphicon"></i>')

      if ($beforeFeedback.size()) {
        $fieldBack.insertAfter($beforeFeedback)

        if ($beforeFeedback.is('.input-group-addon')) $fieldBack.css('right', -2)

      } else {
        $fieldBack.insertAfter($input)
      }

      var $form = element.closest('[ng-form]')
      if (!$form.size()) $form = element.closest('form')

      var field = scope[$form.attr('name')][$input.prop('name')]

      scope.$watch(function () {return field.$modelValue}, function () {
        if (field.$dirty) {
          if (field.$valid) {
            element.removeClass('has-error').addClass('has-success')
            $fieldBack.removeClass('glyphicon-remove').addClass('glyphicon-ok')

          } else {
            element.removeClass('has-success').addClass('has-error')
            $fieldBack.removeClass('glyphicon-ok').addClass('glyphicon-remove')
          }

          $fieldBack.show()
        }
      })

      scope.$watch(function () {return field.$pristine}, function (pristine) {
        if (pristine) {
          element.removeClass('has-success has-error')
          $fieldBack.removeClass('glyphicon-ok glyphicon-remove').hide()
        }
      })
    }
  }
}

app.factory('toISODate', toISODate)
toISODate.$inject = ['moment']
function toISODate(moment) {
  return function (dtObj) {
    return dtObj ? moment(dtObj).format('YYYY-MM-DD') : null
  }
}


require('./commons/toggle-dim-element')
require('./customer/customer.js')
require('./lc-bid-request/lc-bid-request.js')
require('./form-m/form-m.js')
require('./lc/lc.js')
require('./comment/comment.js')
require('./fx-deal/fx-deal.js')
require('./lc-cover/lc-cover.js')
require('./upload-form-m/upload-form-m.js')
require('./lc-issue/lc-issue.js')
require('./commons/number-format.js')
require('./commons/to-upper.js')
require('./commons/toggle-bg-color')
require('./pager-nav/pager-nav.js')
require('./form-validators/form-validators.js')
require('./model-table/model-table.js')
require('./commons/commons.services.js')
require('./search-lc')
require('./confirmation-dialog/confirmation-dialog.js')
require('./complex-object-validator/complex-object-validator.js')
