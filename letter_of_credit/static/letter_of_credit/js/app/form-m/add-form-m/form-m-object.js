"use strict"

/*jshint camelcase:false*/

var app = angular.module('add-form-m-form-m-object', [
  'rootApp',
  'lc-issue-service',
  'lc-cover-service',
  'form-m-service'
])

app.factory('formMObject', formMObject)

formMObject.$inject = [
  'LcBidRequest',
  'LCIssueConcrete',
  'FormMCover',
  'confirmationDialog',
  'formatDate',
  'xhrErrorDisplay',
  'kanmiiUnderscore',
  '$filter',
  'getTypeAheadLCIssue',
  'FormM',
  '$q'
]

function formMObject(LcBidRequest, LCIssueConcrete, FormMCover, confirmationDialog, formatDate, xhrErrorDisplay,
                     kanmiiUnderscore, $filter, getTypeAheadLCIssue, FormM, $q) {
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
      setInitialProperties()
      function setInitialProperties() {
        /*
         *@param {angular.form.model} will hold data for bid we wish to create or edit
         */
        self.bid = {}

        /**
         * Flag that determines whether we are editing bid and will show an edit bid button.
         * @type {boolean}
         */
        self.showEditBid = false

        /**
         * Flag that controls whether to show bid form
         * @type {boolean}
         */
        self.showBidForm = false

        /**
         * Bids that already exist for this form M. These bids can be edited.
         * @type {Array}
         */
        self.existingBids = []

        /**
         * Issues already created for this form M that user has closed. They are merely for display.
         * @type {Array}
         */
        self.closedIssues = []

        /**
         * Issues already created for this form M that are open. User can use this interface to close them
         * @type {Array}
         */
        self.nonClosedIssues = []

        /**
         * Fresh issues that user wishes to create. Will be appended to open issues when created.
         * @type {Array}
         */
        self.selectedIssues = []

        /**
         * The issue that user is currently selecting. Will be pushed into self.selectedIssues
         * @type {null|{}}
         */
        self.issue = null

        /**
         * Flag that controls whether issue form is displayed or hidden.
         * @type {boolean}
         */
        self.showIssueForm = false

        self.covers = []
        self.cover = {}
        self.showCoverForm = false

        self.date_received = new Date()
        self.number = null
        self.applicant = null
        self.currency = null
        self.amount = null
        self.goods_description = null
        self.form_m_issues = null
        self.url = null
      }

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
      }

      cb(self)
    }

    self.formatIssueText = function formatIssueText(text) {return text.replace(/:ISSUE$/i, '')}

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

    self.createIssuesMessage = function createIssuesMessage(issues) {
      issues = self.nonClosedIssues.concat((issues && issues.length) ? issues : [])

      if (!issues.length) return ''

      var issuesText = '\n\n\nPlease note the following issues which must be regularized before the LC ' +
        'request can be treated:\n'

      kanmiiUnderscore.each(issues, function (issue, index) {
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

    /**
     * Fresh in the sense that they have not been attached to this form M either has newly selected issues or closed
     * issues or non-closed issues
     * @param {string} text - the text of the issue to get
     * @returns {[]} - an array of fresh issues for this form M
     */
    self.getFreshIssues = function getFreshIssues(text) {
      var _ids = []

      self.selectedIssues.forEach(function (issue) {
        _ids.push(issue.id)
      })

      var x = []
      var URL_REGEXP = new RegExp(".+/(\\d+)$")

      x.concat(self.nonClosedIssues).concat(self.closedIssues).forEach(function (issue) {
        _ids.push(URL_REGEXP.exec(issue.issue)[1])
      })

      return getTypeAheadLCIssue({text: text, exclude_issue_ids: _ids.join(',')})
    }

    self.saveFormM = function saveFormM(formM, detailedFormM) {
      var formMToSave = {
        applicant: formM.applicant.url,
        currency: formM.currency.url,
        date_received: formatDate(formM.date_received),
        amount: formM.amount,
        number: formM.number,
        goods_description: formM.goods_description
      }

      if (formM.bid.amount && formM.bid.goods_description) {
        formMToSave.goods_description = formM.bid.goods_description
        formMToSave.bid = {amount: Number(formM.bid.amount)}
        // In case user changed goods_description via bid directive
        self.goods_description = formM.bid.goods_description
        formM.goods_description = formM.bid.goods_description
      }

      if (formM.selectedIssues.length) formMToSave.issues = formM.selectedIssues

      if (!kanmiiUnderscore.isEmpty(formM.cover)) {
        formMToSave.cover = {
          amount: formM.cover.amount,
          cover_type: formM.cover.cover_type[0]
        }
      }

      var deferred = $q.defer()

      if (!detailedFormM) new FormM(formMToSave).$save(formMSavedSuccess, formMSavedError)

      else {
        //if we did not edit the main form M i.e detailedFormM = formM, then there is no need for database update
        //we store some attributes of formM that we care about in formMToSave because this will now become detailed
        //form M when we return from server.
        if (kanmiiUnderscore.all(self.compareFormMs(detailedFormM, formM))) {
          formMToSave.do_not_update = 'do_not_update'
          formMToSave.applicant_data = formM.applicant
          formMToSave.currency_data = formM.currency
          formMToSave.url = formM.url
        }
        formMToSave.id = detailedFormM.id
        new FormM(formMToSave).$put(formMSavedSuccess, formMSavedError)
      }

      function formMSavedSuccess(data) {
        console.log('data = ', data.new_issues)
        var summary = self.createFormMMessage() + self.createIssuesMessage(data.new_issues)

        if (formMToSave.bid) {
          summary += '\n\nBid Amount     : ' + data.currency_data.code + ' ' + $filter('number')(formMToSave.bid.amount, 2)
        }

        delete data.new_issues
        deferred.resolve({detailedFormM: data, showSummary: summary})
      }

      function formMSavedError(xhr) {
        deferred.reject(xhr)
      }

      return deferred.promise
    }

    /**
     * Compare certain attributes of two form Ms and returns an object with the attribute as key and equalities of the
     * values of the attributes in the two form Ms as values.
     *
     * @param {{}} formM - first form M to compare. If this is null, then there is no point doing comparison
     * @param {null|{}} otherFormM - optional second form M to compare. If this is not given, then we compare first
     *   form M with self
     * @returns {{}} - an object of form Ms attributes' values equalities
     */
    self.compareFormMs = function compareFormMs(formM, otherFormM) {
      if (!formM) return false

      if (otherFormM) {
        return {
          number: otherFormM.number && angular.equals(otherFormM.number, formM.number),
          date_received: angular.equals(otherFormM.date_received, new Date(formM.date_received)),
          amount: otherFormM.amount && angular.equals(otherFormM.amount, Number(formM.amount)),
          currency: otherFormM.currency && (otherFormM.currency.code === formM.currency_data.code),
          applicant: otherFormM.applicant && (otherFormM.applicant.name === formM.applicant_data.name),
          goods_description: otherFormM.goods_description === formM.goods_description
        }
      }

      return {
        number: self.number && angular.equals(self.number, formM.number),
        date_received: angular.equals(self.date_received, new Date(formM.date_received)),
        amount: self.amount && angular.equals(self.amount, Number(formM.amount)),
        currency: self.currency && (self.currency.code === formM.currency_data.code),
        applicant: self.applicant && (self.applicant.name === formM.applicant_data.name),
        goods_description: self.goods_description === formM.goods_description
      }
    }
  }

  return new Factory()
}
