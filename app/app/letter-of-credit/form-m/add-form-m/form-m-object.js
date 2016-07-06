"use strict"

/*jshint camelcase:false*/

var app = angular.module( 'add-form-m-form-m-object', [
  'rootApp',
  'lc-issue-service',
  'lc-cover-service',
  'form-m-service',
  'comment-service',
  'attachment-service'
] )

app.factory( 'formMObject', formMObject )

formMObject.$inject = [
  'LcBidRequest',
  'LCIssueConcrete',
  'FormMCover',
  'confirmationDialog',
  'formatDate',
  'xhrErrorDisplay',
  'underscore',
  '$filter',
  'getTypeAheadLCIssue',
  'FormM',
  '$q',
  'Comment',
  'Attachment',
]

function formMObject(LcBidRequest, LCIssueConcrete, FormMCover, confirmationDialog, formatDate, xhrErrorDisplay,
  underscore, $filter, getTypeAheadLCIssue, FormM, $q, Comment, Attachment) {
  function Factory() {
    var self = this
    self.datePickerFormat = 'dd-MMM-yyyy'
    var confirmationTitleLength = 40

    function setComments(id) {
      Comment.query( { ct: self.ct_id, pk: id, not_deleted: true } ).$promise.then( function (data) {
        self.comments = data

      }, function (xhr) {
        console.log( 'xhr = ', xhr )
      } )
    }

    function setIssues() {
      LCIssueConcrete.query( { form_m_number: self.number } ).$promise.then( function (data) {
        data.forEach( function (issue) {
          if ( !issue.closed_at ) self.nonClosedIssues.push( issue )
          else self.closedIssues.push( issue )
        } )
      } )
    }

    function setCovers() {
      FormMCover.query( { form_m_number: self.number } ).$promise.then( function (data) {
        self.covers = data
      }, function (xhr) {
        console.log( xhr )
      } )
    }

    self.init = function init(formMNumber, cb) {
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

        /*
         *@param {angular.form.model} will hold text of comment we wish to create or edit
         */
        self.commentText = null

        /**
         * Flag that determines whether we are editing comment and will show an edit comment button.
         * @type {boolean}
         */
        self.showEditComment = false

        /**
         * Flag that controls whether to show comment form
         * @type {boolean}
         */
        self.showCommentForm = false

        /**
         * Comments already created for this form M.
         * @type {Array}
         */
        self.comments = []

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
        self.ct_id = null
        self._id = null
        self.lc_number = null
        self.deleted_at = null
        self.attachments = []
      }

      var formM

      if ( formMNumber ) {
        FormM.getPaginated( { number: formMNumber } ).$promise.then( function (data) {
          if ( data.count ) {
            formM = data.results[0]
            self.date_received = new Date( formM.date_received )
            self.number = formM.number
            self.applicant = formM.applicant_data
            self.currency = formM.currency_data
            self.amount = Number( formM.amount )
            self.goods_description = formM.goods_description
            self.form_m_issues = formM.form_m_issues
            self.url = formM.url
            self.ct_id = formM.ct_id
            self.ct_url = formM.ct_url
            self._id = formM.id
            self.lc_number = formM.lc
            self.deleted_at = formM.deleted_at

            self.setBids()
            setIssues()
            setCovers()
            setComments( self._id )
          }

          cb( self, formM )
        } )

      } else {
        cb( self )
      }

    }

    self.formatIssueText = function formatIssueText(text) {return text.replace( /:ISSUE$/i, '' )}

    self.closeIssue = function closeIssue(issue, $index) {
      var text = 'Sure you want to close issue:\n"' + self.formatIssueText( issue.issue_text ) + '"?'
      confirmationDialog.showDialog( { title: 'Close issue', text: text } ).then( function (answer) {
        if ( answer ) {
          issue.closed_at = formatDate( new Date() )
          LCIssueConcrete.put( issue ).$promise.then( issueClosedSuccess, issueClosedError )
        }
      } )

      function issueClosedSuccess() {
        var text = 'Issue closed successfully:\n' + self.formatIssueText( issue.issue_text )
        confirmationDialog.showDialog( { title: 'Close issue', text: text, infoOnly: true } )
        self.nonClosedIssues.splice( $index, 1 )
        self.closedIssues.push( issue )
      }

      function issueClosedError(xhr) {xhrErrorDisplay( xhr )}
    }

    self.createIssuesMessage = function createIssuesMessage(issues) {
      issues = self.nonClosedIssues.concat( (issues && issues.length) ? issues : [] )

      if ( !issues.length ) return ''

      var issuesText = '\n\n\nPlease note the following issues which must be regularized before the LC ' +
        'request can be treated:\n'

      underscore.each( issues, function (issue, index) {
        ++index
        issuesText += ('(' + index + ') ' + self.formatIssueText( issue.issue_text ) + '\n')
      } )

      return issuesText
    }

    self.createFormMMessage = function createFormMMessage() {
      var amount = $filter( 'number' )( self.amount, 2 )
      var ref = self.lc_number ? self.lc_number + '/' : ''
      var header = self.applicant.name + ' - ' + ref + self.number + ' - ' + self.currency.code + ' ' + amount
      return header + '\n\nForm M Number : ' + self.number + '\n' +
        'Value         : ' + self.currency.code + ' ' +
        amount + '\n' +
        'Applicant     : ' + self.applicant.name
    }

    self.showSummary = function showSummary() {
      confirmationDialog.showDialog( {
        title: self.number,
        text: self.createFormMMessage() + self.createIssuesMessage(),
        infoOnly: true
      } )
    }

    /**
     * Fresh in the sense that they have not been attached to this form M either has newly selected issues or closed
     * issues or non-closed issues
     * @param {string} text - the text of the issue to get
     * @returns {[]} - an array of fresh issues for this form M
     */
    self.getFreshIssues = function getFreshIssues(text) {
      var _ids = []

      self.selectedIssues.forEach( function (issue) {
        _ids.push( issue.id )
      } )

      var x = []
      var URL_REGEXP = new RegExp( ".+/(\\d+)$" )

      x.concat( self.nonClosedIssues ).concat( self.closedIssues ).forEach( function (issue) {
        _ids.push( URL_REGEXP.exec( issue.issue )[1] )
      } )

      return getTypeAheadLCIssue( { text: text, exclude_issue_ids: _ids.join( ',' ) } )
    }

    self.saveFormM = function saveFormM(formM, detailedFormM) {
      var formMToSave = {
        applicant: formM.applicant.url,
        currency: formM.currency.url,
        date_received: formatDate( formM.date_received ),
        deleted_at: formatDate( formM.deleted_at ),
        amount: formM.amount,
        number: formM.number,
        goods_description: formM.goods_description
      }

      if ( formM.lcRef.lc_number ) formMToSave.lc = formM.lcRef.lc_number

      if ( formM.bid.amount && formM.bid.goods_description ) {
        formMToSave.goods_description = self.goods_description = formM.bid.goods_description
        formMToSave.bid = angular.copy( formM.bid )
        formMToSave.bid.amount = Number( formM.bid.amount )
        formMToSave.maturity = formatDate( formM.bid.maturity )
      }

      if ( formM.selectedIssues.length ) formMToSave.issues = formM.selectedIssues

      if ( !underscore.isEmpty( formM.cover ) ) {
        formMToSave.cover = { amount: formM.cover.amount, cover_type: formM.cover.cover_type[0] }
      }

      var deferred = $q.defer()

      if ( !detailedFormM ) new FormM( formMToSave ).$save( formMSavedSuccess, formMSavedError )

      else {
        //if we did not edit the main form M i.e detailedFormM = formM, then there is no need for database update
        if ( underscore.all( self.compareFormMs( detailedFormM, formM ) ) ) {
          if ( !formM.lcRef.lc_number ) formMToSave.do_not_update = 'do_not_update'
          formMToSave.url = formM.url //needed for bid, cover, issues and comments
        }

        formMToSave.id = detailedFormM.id
        new FormM( formMToSave ).$put( formMSavedSuccess, formMSavedError )
      }

      function formMSavedSuccess(data) {
        var summary = self.createFormMMessage() + self.createIssuesMessage( data.new_issues )

        if ( formMToSave.bid ) {
          summary += '\n\nBid Amount     : ' + formM.currency.code + ' ' + $filter( 'number' )( formMToSave.bid.amount, 2 )
        }

        delete data.new_issues
        deferred.resolve( { showSummary: summary, formM: data.number } )
      }

      function formMSavedError(xhr) {
        deferred.reject( xhr )
      }

      return deferred.promise
    }

    self.editFormM = function editFormM(formM) {
      formM.id = self._id
      return FormM.put( formM ).$promise
    }

    /**
     * Compare attributes of pristine form M (form M obtained from server un-edited) and another form and returns an
     * object with the attribute as key and equalities of the values of the attributes in the two form Ms as values.
     *
     * @param {{}} pristineFormM - form M obtained from server un-edited. If this is null, then there is no point doing
     *   comparison
     * @param {null|{}} otherFormM - optional second form M to compare. If this is not given, then we compare first
     *   form M with self
     * @returns {{}} - an object of form Ms attributes' values equalities
     */
    self.compareFormMs = function compareFormMs(pristineFormM, otherFormM) {
      if ( !pristineFormM ) return { all: false }

      var formM = otherFormM ? otherFormM : self

      return {
        number: formM.number && formM.number === pristineFormM.number,
        date_received: angular.equals( formM.date_received, new Date( pristineFormM.date_received ) ),
        amount: self.amount && formM.amount === Number( pristineFormM.amount ),
        currency: formM.currency && (formM.currency.code === pristineFormM.currency_data.code),
        applicant: formM.applicant && (formM.applicant.name === pristineFormM.applicant_data.name),
        goods_description: formM.goods_description === pristineFormM.goods_description,
        deleted_at: formM.deleted_at === pristineFormM.deleted_at,
      }
    }

    self.addComment = function addComment(text) {
      var deferred = $q.defer()

      Comment.save( { content_type: self.ct_url, object_id: self._id, text: text } )
        .$promise.then( function commentFormMSaveSuccess(data) {
        var text = data.text

        confirmationDialog.showDialog( {
          title: 'Comment successfully created "' + text.slice( 0, confirmationTitleLength ) + '"',
          text: text,
          infoOnly: true
        } )

        self.comments.push( data )
        deferred.resolve( data )

      }, function (xhr) {
        xhrErrorDisplay( xhr )
      } )

      return deferred.promise
    }

    self.closeComment = function closeComment(comment) {
      var deferred = $q.defer()
      var text = comment.text

      confirmationDialog.showDialog( {
        title: 'Close comment "' + text.slice( 0, confirmationTitleLength ) + '"',
        text: 'Sure you want to close comment:\n===============================\n' + text
      } ).then( function (answer) {
        if ( answer ) {
          comment.deleted_at = (new Date()).toJSON()

          Comment.put( comment ).$promise.then( function formMCommentCloseSuccess(data) {
            confirmationDialog.showDialog( {
              title: 'Comment successfully closed "' + text.slice( 0, confirmationTitleLength ) + '"',
              text: text,
              infoOnly: true
            } )

            deferred.resolve( data )
            var comments = []

            self.comments.forEach( function (comment) {
              if ( comment.id === data.id ) return
              comments.push( comment )
            } )

            self.comments = comments

          }, function (xhr) {
            xhrErrorDisplay( xhr )
          } )
        }
      } )

      return deferred.promise
    }

    self.editComment = function editComment(text, comment) {
      var deferred = $q.defer()

      confirmationDialog.showDialog( {
        title: 'Edit comment "' + comment.text.slice( 0, confirmationTitleLength ) + '"',
        text: 'Are you sure you want to edit comment:\n======================================\n' + comment.text

      } ).then( function (answer) {
        if ( answer ) {
          comment.text = text

          Comment.put( comment ).$promise.then( function formMCommentEditedSuccess(data) {
            confirmationDialog.showDialog( {
              title: 'Comment successfully changed "' + text.slice( 0, confirmationTitleLength ) + '"',
              text: text,
              infoOnly: true
            } )

            deferred.resolve( data )
            var comments = angular.copy( self.comments )

            for ( var index = 0, len = comments.length; index < len; index++ ) {
              if ( data.id === comments[index].id ) {
                comments[index] = data
                break
              }
            }

            self.comments = comments

          }, function (xhr) {
            xhrErrorDisplay( xhr )
          } )
        }
      } )

      return deferred.promise
    }

    self.setBids = function setBids(cb) {
      self.existingBids = []
      LcBidRequest.getPaginated( { mf: self.number } ).$promise.then( function (data) {

        if ( data.count ) {
          var results = data.results

          if ( results.length ) {
            results.forEach( function (bid) {
              var total_allocation = 0
              var total_utilization = 0

              underscore.each( bid.allocations, function (allocation) {
                total_allocation += allocation.amount_allocated
                total_utilization += allocation.amount_utilized
              } )

              bid.total_allocation = total_allocation
              bid.total_utilization = total_utilization
              bid.unallocated = bid.amount - total_allocation

              self.existingBids.push( bid )
            } )

            if ( cb ) cb( self.existingBids )
          }
        }

      }, function (xhr) {
        console.log( 'xhr = ', xhr )
      } )
    }

    self.setAttachments = function setAttachments() {
      var deferred = $q.defer()

      Attachment.query( { ct: self.ct_id, pk: self._id, not_deleted: true } ).$promise.then( function (data) {

        self.attachments = data
        deferred.resolve( data )

      }, function (xhr) {
        console.log( 'xhr = ', xhr )
        deferred.reject( xhr )
      } )

      return deferred.promise
    }
  }

  return new Factory()
}
