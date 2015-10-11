"use strict";

var app = angular.module('form-m-lc-issue', ['lc-issue-service'])

app.directive('lcIssue', lcIssueDirective)
lcIssueDirective.$inject = ['LCIssue']
function lcIssueDirective(LCIssue) {
  return {
    restrict: 'E',

    templateUrl: require('lcAppCommons').buildUrl('form-m/lc-issue/lc-issue.html'),

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
      onSelect: '&onLcIssueSelected'
    },

    controller: 'LcIssueDirectiveCtrl as lcIssue'
  }
}

app.controller('LcIssueDirectiveCtrl', LcIssueDirectiveCtrl)

LcIssueDirectiveCtrl.$inject = ['$scope']

function LcIssueDirectiveCtrl($scope) {
  var vm = this
  vm.lcIssues = []
  vm.selectedIssues = {}

  $scope.$watch(function getSelectedIssues(){return vm.selectedIssues}, function selectedIssuesChanged(val) {
    vm.onSelect({selectedIssues: val})
  }, true)
}
