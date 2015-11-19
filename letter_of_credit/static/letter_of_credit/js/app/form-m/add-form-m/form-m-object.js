"use strict"

/*jshint camelcase:false*/

var app = angular.module('add-form-m-form-m-object', [
  'rootApp',
  'lc-issue-service',
  'lc-cover-service'
])

app.factory('formMObject', formMObject)

formMObject.$inject = [
  'LcBidRequest',
  '$q',
  'LCIssueConcrete',
  'FormMCover',
  'confirmationDialog',
  'formatDate',
  'xhrErrorDisplay',
  'kanmiiUnderscore',
  '$filter'
]

function formMObject(LcBidRequest, $q, LCIssueConcrete, FormMCover, confirmationDialog, formatDate, xhrErrorDisplay,
  kanmiiUnderscore, $filter) {
  function Factory() {
    var self = this

    function setBids() {
      LcBidRequest.getPaginated({mf: self.number}).$promise.then(function (data) {

        if (data.count) {
          var results = data.results

          if (results.length) {
            self.existingBids = results
          }
        }

      }, function (xhr) {
        console.log('xhr = ', xhr)
      })
    }

    function setIssues() {
      LCIssueConcrete.query({form_m_number: self.number}).$promise.then(function (data) {
        data.forEach(function (issue) {
          if (!issue.closed_at) self.nonClosedIssues.push(issue)
          else self.closedIssues.push(issue)
        })
      })
    }

    function setCovers() {
      FormMCover.query({form_m_number: self.number}).$promise.then(function (data) {
        self.covers = data
      }, function (xhr) {
        console.log(xhr)
      })
    }

    self.init = function init(detailedFormM, cb) {
      /*
       *@param {angular.form.model} bid model that we want to create for the form M
       */
      self.bidObj = {}

      self.existingBids = []

      self.closedIssues = []
      self.nonClosedIssues = []
      self.selectedIssues = []
      self.issue = null

      self.showEditBid = false
      self.showBidForm = false

      if (detailedFormM) {
        self.date_received = new Date(detailedFormM.date_received)
        self.number = detailedFormM.number
        self.applicant = detailedFormM.applicant_data
        self.currency = detailedFormM.currency_data
        self.amount = Number(detailedFormM.amount)
        self.goods_description = detailedFormM.goods_description
        self.form_m_issues = detailedFormM.form_m_issues
        self.url = detailedFormM.url

        setBids()
        setIssues()
        setCovers()

      } else {
        self.date_received = new Date()
        self.number = null
        self.applicant = null
        self.currency = null
        self.amount = null
        self.goods_description = null
        self.form_m_issues = null
        self.url = null
        self.covers = null
      }

      cb(self)
    }

    self.initBids = function initBids() {
      var deferred = $q.defer()

      if (self.number) {

      } else deferred.resolve(self)

      return deferred.promise
    }

    self.formatIssueText = function formatIssueText(text) {
      return text.replace(/:ISSUE$/i, '')
    }

    self.closeIssue = function closeIssue(issue, $index) {
      var text = 'Sure you want to close issue:\n"' + self.formatIssueText(issue.issue_text) + '"?'
      confirmationDialog.showDialog({title: 'Close issue', text: text}).then(function (answer) {
        if (answer) {
          issue.closed_at = formatDate(new Date())
          LCIssueConcrete.put(issue).$promise.then(issueClosedSuccess, issueClosedError)
        }
      })

      function issueClosedSuccess() {
        var text = 'Issue closed successfully:\n' + self.formatIssueText(issue.issue_text)
        confirmationDialog.showDialog({title: 'Close issue', text: text, infoOnly: true})
        self.nonClosedIssues.splice($index, 1)
        self.closedIssues.push(issue)
      }

      function issueClosedError(xhr) {xhrErrorDisplay(xhr)}
    }

    self.createIssuesMessage = function createIssuesMessage() {
      if (!self.nonClosedIssues.length) return ''

      var issuesText = '\n\n\nPlease note the following issues which must be regularized before the LC ' +
        'request can be treated:\n'

      kanmiiUnderscore.each(self.nonClosedIssues, function (issue, index) {
        ++index
        issuesText += ('(' + index + ') ' + self.formatIssueText(issue.issue_text) + '\n')
      })

      return issuesText
    }

    self.createFormMMessage = function createFormMMessage() {
      var number = $filter('number')(self.amount, 2)
      var header = self.applicant.name + ' - ' + self.number + ' - ' + self.currency.code + ' ' + number
      return header + '\n\nForm M Number : ' + self.number + '\n' +
        'Value         : ' + self.currency.code + ' ' +
        number + '\n' +
        'Applicant     : ' + self.applicant.name
    }

    self.showSummary = function showSummary() {
      confirmationDialog.showDialog({
        title: self.number,
        text: self.createFormMMessage() + self.createIssuesMessage(),
        infoOnly: true
      })
    }
  }

  return new Factory()
}
