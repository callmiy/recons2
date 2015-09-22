"use strict";



var app = angular.module('form-m-lc-issue', [])

app.directive('lcIssue', lcIssueDirective)
lcIssueDirective.$inject = ['LCIssue']
function lcIssueDirective(LCIssue) {
  return {
    restrict: 'E',

    templateUrl: require('formMCommons').buildUrl('form-m/lc-issue/lc-issue.html'),

    link: function(scope, element, attributes, self) {

      scope.$watch(function getShow() {return self.show}, function doShow(showVal) {
        self.show = showVal

        if (showVal && !self.lcIssues.length) {
          self.lcIssues = LCIssue.query()
        }
        else {
          element.find('.lc-issue-item-checkbox').each(function() {
            $(this).prop('checked', false).closest('.lc-issue-item').removeClass('selected')
          })

          self.selectedIssues = {}
        }
      })

      element.on({
        'change': function() {
          var $el = $(this)

          $el.closest('.lc-issue-item').toggleClass('selected', $el.prop('checked'))
        }
      }, '.lc-issue-item-checkbox')
    },

    scope: {},

    bindToController: {
      show: '=lcIssueShow',
      selectedIssues: '=lcIssuesSelected'
    },

    controller: 'LcIssueDirectiveCtrl as lcIssue'
  }
}

app.controller('LcIssueDirectiveCtrl', LcIssueDirectiveCtrl)
function LcIssueDirectiveCtrl() {
  var vm = this
  vm.lcIssues = []
  vm.selectedIssues = {}
}
