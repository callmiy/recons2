"use strict"

/*jshint camelcase:false*/

var app = angular.module('add-form-m-form-m-object', ['lc-issue-service'])

app.factory('formMObject', formMObject)

formMObject.$inject = ['LcBidRequest', '$q', 'LCIssueConcrete']

function formMObject(LcBidRequest, $q, LCIssueConcrete) {
  function Factory() {
    var self = this

    function getBids() {
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

    function getIssues() {
      LCIssueConcrete.query({form_m_number: self.number}).$promise.then(function (data) {
        data.forEach(function (issue) {
          if (!issue.closed_at) self.nonClosedIssues.push(issue)
          else self.closedIssues.push(issue)
        })
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
        self.covers = detailedFormM.covers

        getBids()
        getIssues()

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
  }

  return new Factory()
}
