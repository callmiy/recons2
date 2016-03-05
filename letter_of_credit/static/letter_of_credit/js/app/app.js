/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1)
	__webpack_require__(27)

	var rootCommons = __webpack_require__(7)

	var app = angular.module('lc-root-app',
	  ['rootApp',
	   'ui.router',
	   'form-m',
	   'lc'
	  ])

	app.config(rootCommons.interpolateProviderConfig)

	app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
	  $rootScope.$state = $state
	  $rootScope.$stateParams = $stateParams
	}])

	app.config(formMRootAppURLConfig)
	formMRootAppURLConfig.$inject = ['$stateProvider', '$urlRouterProvider']
	function formMRootAppURLConfig($stateProvider, $urlRouterProvider) {
	  $urlRouterProvider
	    .otherwise('/')

	  $stateProvider
	    .state('home', {
	      url: '/',

	      kanmiiTitle: 'Home',

	      template: __webpack_require__(30)
	    })
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	/*jshint camelcase:false*/

	__webpack_require__(2)
	__webpack_require__(11)
	__webpack_require__(16)
	__webpack_require__(18)
	__webpack_require__(19)
	__webpack_require__(21)
	__webpack_require__(24)

	var app = angular.module('form-m',
	  ['rootApp',
	   'ui.router',
	   'list-form-m',
	   'upload-form-m',
	   'add-form-m',
	   'form-m-bids'
	  ])

	app.config(formMURLConfig)
	formMURLConfig.$inject = ['$stateProvider']
	function formMURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m', {
	      url: '/form-m',

	      kanmiiTitle: 'Form M',

	      template: __webpack_require__(26),

	      controller: 'FormMController as formMHome'
	    })
	}

	app.controller('FormMController', FormMController)
	FormMController.$inject = ['$state', '$scope']
	function FormMController($state, $scope) {

	  var listFormMTab = {
	    className: 'list-form-m-tab-ctrl',
	    title: 'List Form M',
	    viewName: 'listFormM',
	    select: function () {
	      $scope.updateAddFormMTitle()
	      $state.go('form_m.list')
	    }
	  }

	  var addFormMTitle = 'Form M'
	  /** Angular uib tab executes 'select' function which invokes $state.go. However, if we are transiting to this state
	   from a place outside angular uib tab, this will result in the state transition function been called twice (see
	   "$scope.goToFormM" function below for example) - one for the calling position and another for angular uib tab. This
	   flag keeps track of whether state transition function had been called and thus helps to avoid duplicate call. A
	   consequence of the duplicate call is that the controller for the addFormMTab is called twice with all sorts of
	   unintended consequences.
	   */
	  var addFormMGoTo = true
	  var addFormMTab = {
	    className: 'add-form-tab-ctrl',
	    title: addFormMTitle,
	    active: true,
	    viewName: 'addFormM',
	    select: function () {
	      if (addFormMGoTo) $state.go('form_m.add')
	      addFormMGoTo = true
	    }
	  }

	  var reportsTab = {
	    title: 'Reports',
	    active: false,
	    viewName: 'formMReports',
	    select: function () {
	      $scope.updateAddFormMTitle()
	      $state.go('form_m.add')
	    }
	  }

	  var bidsTab = {
	    className: 'bid-list-tab-ctrl',
	    title: 'Bids',
	    active: false,
	    viewName: 'bids',
	    select: function () {
	      $scope.updateAddFormMTitle()
	      $state.go('form_m.bids')
	    }
	  }

	  $scope.tabs = {
	    listFormM: listFormMTab,
	    addFormM: addFormMTab,
	    bids: bidsTab,
	    reports: reportsTab
	  }

	  $scope.updateAddFormMTitle = function (formM) {
	    $scope.tabs.addFormM.title = formM ? 'Details of "' + formM.number + '"' : addFormMTitle
	  }

	  $scope.goToFormM = function goToFormM(formMNumber) {
	    addFormMGoTo = false
	    $state.transitionTo('form_m.add', {formM: formMNumber})
	    $scope.tabs.addFormM.active = true
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	__webpack_require__( 3 )
	__webpack_require__( 4 )
	__webpack_require__( 8 )
	__webpack_require__( 9 )
	__webpack_require__( 10 )

	var app = angular.module( 'add-form-m', [
	  'ui.router',
	  'rootApp',
	  'customer',
	  'search-detailed-or-uploaded-form-m',
	  'form-m-service',
	  'lc-cover',
	  'lc-issue',
	  'lc-bid',
	  'form-m-comment',
	  'lc-bid-request',
	  'confirmation-dialog',
	  'add-form-m-form-m-object',
	  'lc-service',
	  'complex-object-validator',
	  'display-uploaded-form-m'
	] )

	app.config( formMStateConfig )

	formMStateConfig.$inject = ['$stateProvider']

	function formMStateConfig($stateProvider) {
	  $stateProvider
	    .state( 'form_m.add', {
	      kanmiiTitle: 'Add form M',

	      params: { showSummary: null, formM: null },

	      views: {
	        addFormM: {
	          templateUrl: __webpack_require__( 5 ).buildUrl( 'form-m/add-form-m/add-form-m.html' ),

	          controller: 'AddFormMStateController as addFormMState'
	        }
	      }
	    } )
	}

	app.controller( 'AddFormMStateController', AddFormMStateController )

	AddFormMStateController.$inject = [
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency',
	  'SearchDetailedOrUploadedFormMService',
	  'underscore',
	  'xhrErrorDisplay',
	  '$stateParams',
	  'resetForm2',
	  '$state',
	  '$scope',
	  'confirmationDialog',
	  'formMObject',
	  'formMAttributesVerboseNames',
	  'getTypeAheadLetterOfCredit',
	  'DisplayUploadedFormMModal',
	]

	function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
	  underscore, xhrErrorDisplay, $stateParams, resetForm2, $state, $scope, confirmationDialog, formMObject,
	  formMAttributesVerboseNames, getTypeAheadLetterOfCredit, DisplayUploadedFormMModal) {
	  var vm = this

	  function initFormMCb(formM, detailedFormM) {
	    $stateParams.formM = null
	    vm.formM = formM
	    vm.formM.lcRef = { lc_number: null }
	    vm.detailedFormM = detailedFormM

	    if ( detailedFormM ) {
	      vm.fieldIsEditable = {
	        number: false,
	        currency: false,
	        applicant: false,
	        date_received: false,
	        amount: false,
	        lcRef: false
	      }
	    }

	    $scope.updateAddFormMTitle( detailedFormM )
	    formMSavedSuccessMessage()
	  }

	  initialize()
	  function initialize(form, formMNumber) {

	    if ( form ) {
	      var elements = ['applicant', 'currency'].concat( $scope.newFormMForm.lcRef ? ['lcRef'] : [] )
	      resetForm2( form, [{ form: $scope.newFormMForm, elements: elements }] )
	      form.$setPristine()
	      form.$setUntouched()
	    }

	    vm.detailedFormM = null
	    vm.fieldIsEditable = {
	      number: true,
	      currency: true,
	      applicant: true,
	      date_received: true,
	      amount: true,
	      lcRef: true
	    }
	    formMObject.init( formMNumber || $stateParams.formM, initFormMCb )
	    vm.searchFormM = {}
	    vm.action = '';
	  }

	  vm.reset = initialize

	  function formMSavedSuccessMessage() {
	    var summary = $stateParams.showSummary
	    $stateParams.showSummary = null

	    if ( summary ) {
	      confirmationDialog.showDialog( {
	        title: '"' + vm.formM.number + '" successfully saved',
	        text: summary,
	        infoOnly: true
	      } )
	    }
	  }

	  vm.enableFieldEdit = function enableFieldEdit(field) {
	    vm.fieldIsEditable[field] = vm.detailedFormM ? !vm.fieldIsEditable[field] : true
	  }

	  vm.disableSubmitBtn = function disableSubmitBtn() {
	    if ( $scope.newFormMForm.$invalid ) return true

	    if ( underscore.has( vm.formM.coverForm, '$invalid' ) && vm.formM.coverForm.$invalid ) return true

	    if ( underscore.has( vm.formM.bidForm, '$invalid' ) && vm.formM.bidForm.$invalid ) return true

	    if ( underscore.has( vm.formM.issuesForm, '$invalid' ) && vm.formM.issuesForm.$invalid ) return true

	    if ( underscore.has( vm.formM.commentForm, '$invalid' ) && vm.formM.commentForm.$invalid ) return true

	    if ( formMObject.showEditBid || formMObject.showCommentForm ) return true

	    var compared = formMObject.compareFormMs( vm.detailedFormM )

	    if ( !compared ) return false

	    if ( underscore.all( compared ) ) {
	      if ( formMObject.bid.goods_description && formMObject.bid.amount ) return false
	      if ( !underscore.isEmpty( vm.formM.cover ) ) return false
	      if ( vm.formM.lcRef.lc_number ) return false
	      return !vm.formM.selectedIssues.length
	    }

	    return false
	  }

	  vm.getLc = function (lcRef) {
	    return getTypeAheadLetterOfCredit( { lc_number: lcRef.trim(), mf: vm.formM.number } )
	  }
	  vm.getApplicant = getTypeAheadCustomer
	  vm.getCurrency = getTypeAheadCurrency
	  vm.datePickerFormat = 'dd-MMM-yyyy'
	  vm.datePickerIsOpen = false
	  vm.openDatePicker = function openDatePicker() {
	    vm.datePickerIsOpen = true
	  }

	  vm.getUploadedFormM = function getUploadedFormM() {
	    vm.detailedFormM = null
	    initialize()

	    SearchDetailedOrUploadedFormMService.searchWithModal().then( function (data) {
	      if ( data.number ) {
	        initialize( null, data.number )

	      } else {
	        DisplayUploadedFormMModal.display( data.singleWinFormMs ).then( function (formM) {
	          if ( formM ) {
	            vm.searchFormM = formM
	            vm.formM.number = formM.mf
	            vm.formM.amount = formM.cost_freight
	            vm.formM.goods_description = formM.goods_description

	            getTypeAheadCurrency( formM.ccy ).then( function (ccy) {
	              vm.formM.currency = ccy[0]
	            } )
	          }
	        } )
	      }
	    } )
	  }

	  function saveFormMError(xhr) { xhrErrorDisplay( xhr, formMAttributesVerboseNames ) }

	  vm.submit = function submit(formM) {
	    formMObject.saveFormM( formM, vm.detailedFormM ).then( function saveFormMSuccess(data) {
	      $state.go( 'form_m.add', data )

	    }, saveFormMError )
	  }

	  vm.doAction = function doAction(action, formM) {

	    switch (action) {
	      case 'cancel':
	      case 'reinstate':
	        cancelOrReinstate( formM, action )
	        break

	      default:
	        console.log( 'default' )
	    }
	  }

	  /**
	   * Cancel for reinstate a form M
	   * @param {{}} formM - the form M to cancel or reinstate
	   * @param {string} action - the action to take, whether cancel or reinstate - defaults to cancel
	   */
	  function cancelOrReinstate(formM, action) {
	    var title = 'Cancel Form M "' + formM.number + '"'
	    var text = 'Are you sure you want to cancel "' + formM.number + '"?'
	    var deletedAt = new Date()

	    if ( action === 'reinstate' ) {
	      title = 'Reinstate Form M "' + formM.number + '"'
	      text = 'Are you sure you want to reinstate "' + formM.number + '"?'
	      deletedAt = null
	    }

	    confirmationDialog.showDialog( { title: title, text: text, } ).then( function (answer) {
	      if ( answer ) {
	        formM.deleted_at = deletedAt
	        formMObject.saveFormM( formM, vm.detailedFormM ).then( function saveFormMSuccess(data) {
	          $state.go( 'form_m.add', { formM: data.formM } )

	        }, saveFormMError )
	      }
	    } )
	  }
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict"

	/*jshint camelcase:false*/

	var app = angular.module( 'add-form-m-form-m-object', [
	  'rootApp',
	  'lc-issue-service',
	  'lc-cover-service',
	  'form-m-service',
	  'comment-service'
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
	  'Comment'
	]

	function formMObject(LcBidRequest, LCIssueConcrete, FormMCover, confirmationDialog, formatDate, xhrErrorDisplay,
	  underscore, $filter, getTypeAheadLCIssue, FormM, $q, Comment) {
	  function Factory() {
	    var self = this
	    self.datePickerFormat = 'dd-MMM-yyyy'
	    var confirmationTitleLength = 40

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
	        formMToSave.bid = { amount: Number( formM.bid.amount ), maturity: formatDate( formM.bid.maturity ) }
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
	  }

	  return new Factory()
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module( 'lc-issue', [
	  'rootApp',
	  'add-form-m-form-m-object'
	] )

	app.directive( 'lcIssue', lcIssueDirective )

	lcIssueDirective.$inject = []

	function lcIssueDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__( 5 ).buildUrl( 'form-m/add-form-m/lc-issue/lc-issue.html' ),
	    scope: true,
	    bindToController: {
	      onIssuesChanged: '&'
	    },
	    controller: 'LcIssueDirectiveController as lcIssue'
	  }
	}

	app.controller( 'LcIssueDirectiveController', LcIssueDirectiveController )

	LcIssueDirectiveController.$inject = [
	  '$scope',
	  'resetForm2',
	  'clearFormField',
	  'formMObject'
	]

	function LcIssueDirectiveController($scope, resetForm2, clearFormField, formMObject) {
	  var vm = this
	  vm.formM = formMObject
	  var title = 'Add Letter Of Credit Issues'

	  init()
	  function init(form) {
	    vm.title = title
	    formMObject.selectedIssues = []
	    formMObject.issue = null

	    if ( form ) resetForm2( form, [
	      { form: form, elements: ['issue'] }
	    ] )
	  }

	  vm.issueSelected = function issueSelected($item, $model) {
	    formMObject.selectedIssues.push( $model )
	    formMObject.issue = null
	    clearFormField( $scope.issuesForm, 'issue' )
	  }

	  vm.deleteIssue = function deleteIssue(index) {
	    vm.formM.selectedIssues.splice( index, 1 )
	  }

	  vm.toggleShow = function toggleShow(form) {
	    if ( vm.formM.deleted_at ) {
	      formMObject.showIssueForm = false
	      return
	    }

	    formMObject.showIssueForm = vm.formM.amount && vm.formM.number && !formMObject.showIssueForm

	    if ( !formMObject.showIssueForm ) init( form )
	    else vm.title = 'Dismiss'
	  }

	  $scope.$watch( function getFormM() {return vm.formM}, function (formM) {
	    vm.formM.issuesForm = $scope.issuesForm

	    if ( formM ) {
	      if ( !formM.amount || !formM.number ) {
	        init( formMObject.issueForm )
	      }
	    }
	  }, true )

	  $scope.$watch( function getShowContainer() {return formMObject.showIssueForm}, function onUpdateShowContainer() {
	    $scope.issuesForm.issue.$validate()
	  } )
	}

	app.directive( 'validateIssues', function validateIssues() {
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function ($scope, elm, attributes, ctrl) {
	      var vm = $scope.lcIssue
	      ctrl.$validators.issues = function () {
	        return !vm.formM.showIssueForm || Boolean( vm.formM.selectedIssues.length )
	      }
	    }
	  }
	} )


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var lcCommons = __webpack_require__(6)

	/**
	 * @description
	 *
	 * @param {String} fsPath - the path relative to the form-m directory
	 * @returns {*|string}
	 */
	function buildUrl(fsPath) {
	  return lcCommons.buildUrl('app') + '/' + fsPath
	}

	module.exports = {
	  buildUrl: buildUrl
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var rootCommons = __webpack_require__(7)

	var appName = 'letter_of_credit'

	function buildUrl(fsPath) {
	  return rootCommons.buildUrl(appName, fsPath)
	}

	module.exports = {
	  buildUrl: buildUrl,
	  appName: appName
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var interpolateProviderConfig = ['$interpolateProvider', function ($interpolateProvider) {
	  $interpolateProvider.startSymbol('{$');
	  $interpolateProvider.endSymbol('$}');
	}];

	/**
	 * Takes a file system path to a file (most likely a template path) and returns the server compatible path
	 *
	 * @param {string} appName - the name of the django app
	 * @param {string} fsPath - relative path to a file resource on disk. The path must be relative to appName/js directory
	 *   path
	 * @returns {string} - a server compatible path
	 */
	function buildUrl(appName, fsPath) {
	  return staticPrefix + appName + '/js/' + fsPath
	}

	/**
	 * sets the static root on an angular app - so we can use a variable in our views rather hard-coding the static root
	 * value
	 * @param {angular.module} app the angular module on which we wish to set the static root
	 */
	function setStaticPrefix(app) {
	  app.run(['$rootScope', function ($rootScope) {
	    $rootScope.staticPrefix = staticPrefix
	    $rootScope.addIconSrc = staticPrefix + 'core_recons/css/images/icon_addposting.gif'
	  }])
	}

	module.exports = {
	  interpolateProviderConfig: interpolateProviderConfig,

	  buildUrl: buildUrl,

	  rootAppName: 'core_recons',

	  setStaticPrefix: setStaticPrefix
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint camelcase:false*/

	"use strict";

	var app = angular.module( 'lc-cover', [
	  'rootApp',
	  'add-form-m-form-m-object'
	] )

	app.directive( 'lcCover', lcIssueDirective )

	lcIssueDirective.$inject = []

	function lcIssueDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__( 5 ).buildUrl( 'form-m/add-form-m/lc-cover/lc-cover.html' ),
	    scope: true,
	    bindToController: {
	      formM: '=mfContext',
	      cover: '=',
	      onCoverChanged: '&'
	    },
	    controller: 'LcCoverDirectiveController as lcCover'
	  }
	}

	app.controller( 'LcCoverDirectiveController', LcCoverDirectiveController )

	LcCoverDirectiveController.$inject = [
	  '$scope',
	  'formMCoverTypes',
	  '$filter',
	  'formFieldIsValid',
	  'formMObject'
	]

	function LcCoverDirectiveController($scope, formMCoverTypes, $filter, formFieldIsValid, formMObject) {
	  var vm = this
	  vm.formM = formMObject
	  var title = 'Register Cover'
	  init()

	  function init(form) {
	    vm.title = title
	    vm.coverTypes = null
	    formMObject.cover = {}

	    if ( form ) {
	      form.$setPristine()
	      form.$setUntouched()
	    }
	  }

	  vm.isValid = function isValid(name, validity) {
	    return formFieldIsValid( $scope, 'coverForm', name, validity )
	  }

	  vm.amountGetterSetter = function (val) {
	    if ( arguments.length ) {
	      if ( !/[\d,\.]+/.test( val ) ) formMObject.cover.amount = null
	      else formMObject.cover.amount = Number( val.replace( /,/g, '' ) )
	    } else return formMObject.cover.amount ? $filter( 'number' )( formMObject.cover.amount, 2 ) : ''
	  }

	  vm.toggleShow = function toggleShow(form) {
	    if ( vm.formM.deleted_at ) {
	      formMObject.showCoverForm = false
	      return
	    }

	    formMObject.showCoverForm = vm.formM.amount && vm.formM.number && !formMObject.showCoverForm

	    if ( !formMObject.showCoverForm ) {
	      init( form )
	    }
	    else {
	      vm.title = 'Dismiss'
	      vm.coverTypes = formMCoverTypes
	      formMObject.cover.amount = vm.formM.amount
	    }
	  }

	  $scope.$watch( function getFormM() {return vm.formM}, function (formM) {
	    formMObject.coverForm = $scope.coverForm
	    if ( formM ) {
	      if ( !formM.amount || !formM.number ) {
	        init( formMObject.coverForm )
	      }
	    }
	  }, true )
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module( 'lc-bid', ['add-fx-allocation', 'lc-bid-request'] )

	app.directive( 'lcBid', lcBidDirective )

	lcBidDirective.$inject = []

	function lcBidDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__( 5 ).buildUrl( 'form-m/add-form-m/lc-bid/lc-bid.html' ),
	    scope: true,
	    controller: 'LcBidDirectiveController as lcBid'
	  }
	}

	app.controller( 'LcBidDirectiveController', LcBidDirectiveController )

	LcBidDirectiveController.$inject = [
	  '$scope',
	  '$filter',
	  'formFieldIsValid',
	  'underscore',
	  'LcBidRequest',
	  'xhrErrorDisplay',
	  'confirmationDialog',
	  'formMObject',
	  'resetForm2',
	  'moment',
	  'toISODate',
	  'ViewBidDetail'
	]

	function LcBidDirectiveController($scope, $filter, formFieldIsValid, underscore, LcBidRequest, xhrErrorDisplay,
	  confirmationDialog, formMObject, resetForm2, moment, toISODate, ViewBidDetail) {
	  var vm = this
	  vm.formM = formMObject
	  var title = 'New Bid Request'
	  vm.selectedBids = {}

	  init()
	  function init(form) {
	    vm.datePickerIsOpen = {
	      bidRequestedDate: false,
	      bidCreatedDate: false,
	      bidMaturityDate: false
	    }
	    vm.title = title
	    vm.formM.showBidForm = false
	    vm.formM.showEditBid = false
	    vm.bidToEdit = null
	    formMObject.bid = {}
	    vm.showAllocateFx = false

	    if ( form ) {
	      var bidFormCtrlNames = ['bidMaturityDate', 'bidAmount', 'bidGoodsDescription']
	      resetForm2( form, [{ form: form, elements: bidFormCtrlNames }] )
	    }
	  }

	  vm.openDatePicker = function openDatePicker(prop) {
	    underscore.each( vm.datePickerIsOpen, function (val, key) {
	      vm.datePickerIsOpen[key] = prop === key
	    } )
	  }

	  vm.isValid = function (name, validity) {
	    return formFieldIsValid( $scope, 'bidForm', name, validity )
	  }

	  vm.amountGetterSetter = function (val) {
	    if ( arguments.length ) {
	      if ( !/[\d,\.]+/.test( val ) ) vm.formM.bid.amount = null
	      else vm.formM.bid.amount = Number( val.replace( /,/g, '' ) )

	    } else return vm.formM.bid.amount ? $filter( 'number' )( vm.formM.bid.amount, 2 ) : null
	  }

	  vm.toggleShow = function toggleShow(form) {
	    if ( vm.formM.deleted_at ) {
	      vm.formM.showBidForm = false
	      return
	    }

	    vm.formM.showBidForm = vm.formM.amount && vm.formM.number && !vm.formM.showBidForm

	    if ( !vm.formM.showBidForm ) init( form )
	    else {
	      vm.showAllocateFx = false
	      vm.title = 'Dismiss'
	      formMObject.bid.goods_description = formMObject.goods_description
	      vm.formM.bid.amount = !vm.formM.existingBids.length ? formMObject.amount : null
	    }
	  }

	  vm.editBidInvalid = function editBidInvalid(form) {
	    if ( underscore.isEmpty( vm.bidToEdit ) ) return true

	    if ( form.$invalid ) return true

	    return underscore.all( bidNotModified() )
	  }

	  function copyBidForEdit() {
	    vm.bidToEdit.amount = Number( vm.bidToEdit.amount )
	    vm.formM.bid.amount = vm.bidToEdit.amount
	    vm.formM.bid.downloaded = vm.bidToEdit.downloaded
	    vm.bidToEdit.created_at = new Date( vm.bidToEdit.created_at )
	    vm.formM.bid.created_at = vm.bidToEdit.created_at
	    vm.bidToEdit.requested_at = vm.bidToEdit.requested_at ? new Date( vm.bidToEdit.requested_at ) : null
	    vm.formM.bid.requested_at = vm.bidToEdit.requested_at
	    vm.bidToEdit.maturity = vm.bidToEdit.maturity ? new Date( vm.bidToEdit.maturity ) : null
	    vm.formM.bid.maturity = vm.bidToEdit.maturity
	  }

	  function toHumanDate(dtObj) {
	    return dtObj ? moment( dtObj ).format( 'DD-MMM-YYYY' ) : null
	  }

	  function getSelectedBids(selections) {
	    var index, result = []

	    for ( index in selections ) {
	      if ( selections[index] ) {
	        var bid = getBidFromId( index )
	        if ( bid ) result.push( bid )
	      }
	    }

	    return result
	  }

	  vm.onEditBid = function onEditBid(selectedBids, form) {
	    var bids = getSelectedBids( selectedBids )
	    if ( bids.length !== 1 ) return
	    form.$setPristine()
	    vm.formM.showEditBid = true
	    vm.formM.showBidForm = false
	    vm.toggleShow()
	    vm.bidToEdit = angular.copy( bids[0] )
	    copyBidForEdit()
	  }

	  vm.trashBid = function trashBid(selectedBids) {
	    var bids = getSelectedBids( selectedBids )
	    if ( bids.length !== 1 ) return
	    init()
	    var bid = bids[0]
	    var text = '\n' +
	      '\nApplicant  : ' + bid.applicant +
	      '\nForm M     : ' + bid.form_m_number +
	      '\nBid Amount : ' + bid.currency + ' ' + $filter( 'number' )( bid.amount, 2 )

	    var mf = '"' + bid.form_m_number + '"'

	    confirmationDialog.showDialog( {
	      text: 'Sure you want to delete bid:' + text, title: 'Delete bid for ' + mf
	    } ).then( function (answer) {
	      if ( answer ) {
	        LcBidRequest.delete( bid ).$promise.then( bidDeleteSuccess, function bidDeleteFailure(xhr) {
	          xhrErrorDisplay( xhr )
	        } )
	      }
	    } )

	    function bidDeleteSuccess() {
	      confirmationDialog.showDialog( {
	        text: 'Bid delete successfully:' + text,
	        title: 'Bid for ' + mf + ' deleted successfully',
	        infoOnly: true
	      } )
	      formMObject.setBids()
	      vm.selectedBids = {}
	    }
	  }

	  function createEditBidMessage(bidIsNotModified) {
	    var text = '\n\nForm M:           ' + vm.bidToEdit.form_m_number
	    var ccy = formMObject.currency.code

	    if ( !bidIsNotModified.amount ) {
	      text += '\nBid Amount' +
	        '\n  before edit:    ' + ccy + $filter( 'number' )( vm.bidToEdit.amount, 2 ) +
	        '\n  after edit:     ' + ccy + $filter( 'number' )( formMObject.bid.amount, 2 )
	    }

	    if ( !bidIsNotModified.goods_description ) {
	      text += '\nGoods description' +
	        '\n  before edit:    ' + vm.bidToEdit.goods_description +
	        '\n  after edit:     ' + formMObject.bid.goods_description
	    }

	    if ( !bidIsNotModified.maturity ) {
	      text += '\nMaturity' +
	        '\n  before edit:    ' + toHumanDate( vm.bidToEdit.maturity ) +
	        '\n  after edit:     ' + toHumanDate( formMObject.bid.maturity )
	    }

	    if ( !bidIsNotModified.created_at ) {
	      text += '\nDate created' +
	        '\n  before edit:    ' + toHumanDate( vm.bidToEdit.created_at ) +
	        '\n  after edit:     ' + toHumanDate( formMObject.bid.created_at )
	    }

	    if ( !bidIsNotModified.requested_at ) {
	      text += '\nDate requested' +
	        '\n  before edit:    ' + toHumanDate( vm.bidToEdit.requested_at ) +
	        '\n  after edit:     ' + toHumanDate( formMObject.bid.requested_at )
	    }

	    if ( !bidIsNotModified.downloaded ) {
	      text += '\nDownloaded' +
	        '\n  before edit:    ' + vm.bidToEdit.downloaded +
	        '\n  after edit:     ' + vm.formM.bid.downloaded
	    }

	    return text
	  }

	  vm.editBid = function editBid() {
	    var title = 'Edit bid "' + vm.bidToEdit.form_m_number + '"'
	    var bidIsNotModified = bidNotModified()
	    var text = createEditBidMessage( bidIsNotModified )


	    confirmationDialog.showDialog( {
	      title: title,
	      text: 'Are you sure you want to edit Bid:' + text
	    } ).then( function (answer) {
	      if ( answer ) doEdit()
	      else copyBidForEdit()
	    } )

	    function doEdit() {
	      var bid = angular.copy( vm.bidToEdit )

	      if ( !bidIsNotModified.goods_description ) {
	        bid.update_goods_description = true
	        formMObject.goods_description = formMObject.bid.goods_description
	      }

	      underscore.each( formMObject.bid, function (val, key) {
	        if ( key === 'created_at' || key === 'requested_at' || key === 'maturity' ) val = toISODate( val )
	        bid[key] = val
	      } )

	      LcBidRequest.put( bid ).$promise.then( function () {
	        confirmationDialog.showDialog( { title: title, text: 'Edit successful: ' + text, infoOnly: true } )
	        init()
	        formMObject.setBids( bidsNewlySetCb )

	      }, function (xhr) {
	        xhrErrorDisplay( xhr )
	      } )
	    }
	  }

	  vm.viewBidDetail = function (selectedBids) {
	    var bids = getSelectedBids( selectedBids )
	    if ( bids.length !== 1 ) return
	    init()
	    ViewBidDetail.showDialog( { bid: bids[0] } )
	  }

	  vm.allocateFx = function allocateFx(selectedBids) {
	    var bids = getSelectedBids( selectedBids )
	    if ( bids.length !== 1 ) return
	    var bid = bids[0]
	    vm.formM.showBidForm = false
	    vm.title = title

	    vm.initialBidProps = {
	      currency: formMObject.currency,
	      content_type: bid.ct_url,
	      object_id: bid.id
	    }
	    vm.allocationTitle = 'bid amount: ' + $filter( 'number' )( bid.amount, 2 )
	    vm.showAllocateFx = true
	  }

	  vm.onFxAllocated = function onFxAllocated(result) {
	    function getAmount(val) {
	      return result.currency_data.code + ' ' + $filter( 'number' )( val, 2 )
	    }

	    var text = '' +
	      '\nDeal number     : ' + result.deal_number +
	      '\nDeal date       : ' + $filter( 'date' )( result.allocated_on, 'dd-MMM-yyyy' ) +
	      '\nAmount allocated: ' + getAmount( result.amount_allocated ) +
	      '\nAmount utilized : ' + getAmount( result.amount_utilized ) +
	      '\nDate utilized   : ' + $filter( 'date' )( result.utilized_on, 'dd-MMM-yyyy' )

	    confirmationDialog.showDialog( { title: 'Allocation success', text: text, infoOnly: true } )
	    init()
	    formMObject.setBids( bidsNewlySetCb )
	  }

	  vm.dismissShowAllocateFxForm = function dismissShowAllocateFxForm() {
	    vm.showAllocateFx = false
	  }

	  function bidNotModified() {
	    return {
	      amount: vm.bidToEdit.amount === formMObject.bid.amount,
	      goods_description: vm.bidToEdit.goods_description === formMObject.bid.goods_description,
	      downloaded: vm.bidToEdit.downloaded === formMObject.bid.downloaded,
	      created_at: angular.equals( vm.bidToEdit.created_at, formMObject.bid.created_at ),
	      requested_at: angular.equals( vm.bidToEdit.requested_at, formMObject.bid.requested_at ),
	      maturity: angular.equals( vm.bidToEdit.maturity, formMObject.bid.maturity )
	    }
	  }

	  function getBidFromId(id) {
	    for ( var bidIndex = 0; bidIndex < vm.formM.existingBids.length; bidIndex++ ) {
	      var bid = vm.formM.existingBids[bidIndex]

	      if ( bid.id === +id ) return bid
	    }

	    return null
	  }

	  function checkBids(selectedBids) {
	    vm.selectedBidsLen = 0

	    underscore.each( selectedBids, function (checked, id) {
	      if ( checked ) ++vm.selectedBidsLen

	      var bid = getBidFromId( id )
	      if ( bid ) bid.checked = checked

	    } )

	    if ( formMObject.existingBids.length && !vm.selectedBidsLen ) init()
	  }

	  function bidsNewlySetCb() {
	    checkBids( vm.selectedBids )
	  }

	  $scope.$watch( function getFormMObject() {return formMObject}, function onFormMObjectChanged(formM) {
	    formMObject.bidForm = $scope.bidForm

	    if ( formM ) {
	      if ( !formM.amount || !formM.number ) {
	        init( formMObject.bidForm )
	        vm.selectedBids = {}
	        vm.selectedBidsLen = 0
	      }
	    }
	  }, true )

	  $scope.$watch( function getSelectedBids() {return vm.selectedBids}, function onSelectedBidsChanged(selectedBids) {
	    if ( selectedBids ) checkBids( selectedBids )
	  }, true )
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module('form-m-comment', [
	  'rootApp',
	  'comment-service'
	])

	app.directive('formMComment', formMCommentDirective)

	formMCommentDirective.$inject = []

	function formMCommentDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__(5).buildUrl('form-m/add-form-m/comment/comment.html'),
	    scope: true,
	    controller: 'FormMCommentDirectiveController as formMComment'
	  }
	}

	app.controller('FormMCommentDirectiveController', FormMCommentDirectiveController)

	FormMCommentDirectiveController.$inject = [
	  '$scope',
	  'formFieldIsValid',
	  'underscore',
	  'confirmationDialog',
	  'formMObject',
	  'resetForm2'
	]

	function FormMCommentDirectiveController($scope, formFieldIsValid, underscore, confirmationDialog, formMObject,
	  resetForm2) {
	  var vm = this
	  vm.formM = formMObject
	  var title = 'Add comment'
	  var confirmationTitleLength = 40

	  init()
	  function init(form) {
	    vm.title = title
	    vm.formM.showCommentForm = false
	    vm.formM.showEditComment = false
	    vm.commentToEdit = null
	    formMObject.commentText = null

	    if (form) resetForm2(form)
	  }

	  vm.isValid = function (name, validity) { return formFieldIsValid($scope, 'commentForm', name, validity) }

	  vm.toggleShow = function toggleShow(form) {
	    vm.formM.showCommentForm = formMObject._id && !vm.formM.showCommentForm

	    if (!vm.formM.showCommentForm) init(form)
	    else vm.title = 'Dismiss'
	  }

	  vm.editCommentInvalid = function editCommentInvalid(form) {
	    if (underscore.isEmpty(vm.commentToEdit) || form.$invalid) return true

	    return vm.commentToEdit.text === formMObject.commentText
	  }

	  vm.onCommentDblClick = function onCommentDblClick(comment) {
	    vm.formM.showEditComment = true
	    vm.formM.showCommentForm = false
	    vm.toggleShow()
	    vm.commentToEdit = angular.copy(comment)
	    formMObject.commentText = vm.commentToEdit.text
	  }

	  vm.viewComment = function viewComment(comment) {
	    confirmationDialog.showDialog({
	      title: 'View comment "' + comment.text.slice(0, confirmationTitleLength) + '"',
	      text: comment.text,
	      infoOnly: true
	    })
	  }

	  vm.editComment = function editComment(text, form) {
	    formMObject.editComment(text, vm.commentToEdit).then(function () {init(form)})
	  }

	  vm.addComment = function addComment(text, form) {
	    formMObject.addComment(text).then(function () { init(form) })
	  }

	  $scope.$watch(function () {return formMObject}, function onFormMObjectChanged(formM) {
	    formMObject.commentForm = $scope.commentForm

	    if (formM) {
	      if (!formM.amount || !formM.number) init(formMObject.commentForm)
	    }
	  }, true)
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	__webpack_require__(12)

	var app = angular.module('form-m-bids', [
	  'ui.router',
	  'lc-bid-request',
	  'rootApp',
	  'kanmii-URI',
	  'search-bids'
	])

	app.config(bidURLConfig)
	bidURLConfig.$inject = ['$stateProvider']
	function bidURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m.bids', {

	      kanmiiTitle: 'Bids',

	      views: {
	        bids: {
	          template: __webpack_require__(14),

	          controller: 'BidRequestController as bidHome'
	        }
	      }
	    })
	}

	app.controller('BidRequestController', BidRequestController)
	BidRequestController.$inject = [
	  'LcBidRequest',
	  '$scope',
	  '$http',
	  'kanmiiUri',
	  'urls',
	  'underscore',
	  'formatDate',
	  '$timeout',
	  '$q'
	]
	function BidRequestController(LcBidRequest, $scope, $http, kanmiiUri, urls, underscore, formatDate, $timeout, $q) {
	  var vm = this;

	  initialize()
	  function initialize() {
	    vm.selectedBids = {}
	    vm.selectedDownloadedBids = {}

	    /**
	     * The bids retrieved from backend. Will contain a list of bids and pagination hooks for
	     * retrieving the next and previous sets of bids. This model is used by the display directive
	     * to display the bids in a table
	     * @type {object}
	     */
	    vm.bidRequests = []
	    vm.paginationHooks = {}

	    if (!arguments.length) {
	      LcBidRequest.pending().$promise.then(function (data) {
	        updateBids(data)
	      })
	    }
	  }

	  /**
	   * When a row of the pending bids table is clicked, this function is invoked with the bid at that row
	   * @param {{}} bid - the bid object at the row that was double clicked
	   */
	  vm.rowDblClickCb = function rowDblClickCb(bid) {
	    $scope.goToFormM(bid.form_m_number)
	  }

	  /**
	   * Will be invoked when any of the pager links is clicked in other to get the bids at the pager url
	   * @type {getBidsOnNavigation}
	   */
	  vm.getBidsOnNavigation = getBidsOnNavigation
	  function getBidsOnNavigation(linkUrl) {
	    $http.get(linkUrl).then(function (response) {
	      updateBids(response.data)
	    })
	  }

	  vm.onBidsSearched = function onBidsSearched(result) {
	    initialize(false)
	    updateBids(result)
	  }

	  $scope.$watch(function searchedBidResult() {return vm.searchedBidResult},
	    function searchedBidResultChanged(searchedBidResult) {
	      if (searchedBidResult) {
	        updateBids(searchedBidResult)
	      }
	    })

	  /**
	   * Update the bid collection and pagination hooks
	   * @param {object} data
	   */
	  function updateBids(data) {
	    vm.bidRequests = data.results
	    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
	  }

	  var url = kanmiiUri(urls.lcBidRequestDownloadUrl)
	  vm.downloadUrl = function downloadUrl() {
	    if (!underscore.isEmpty(vm.selectedBids)) {
	      var search = []

	      underscore.each(vm.selectedBids, function (selection, bidId) {
	        if (selection === true) search.push(bidId)
	      })

	      return search.length ? url.search({bid_ids: search}).toString() : null
	    }

	    return null
	  }

	  vm.downloadBtnDisabled = function downloadBtnDisabled() {
	    if (underscore.isEmpty(vm.selectedBids)) return true

	    return !underscore.any(vm.selectedBids, function (selectionVal) {
	      return selectionVal === true
	    })
	  }

	  vm.onSelectedBidsChanged = onSelectedBidsChanged
	  function onSelectedBidsChanged(newSelections) {
	    if (newSelections && !underscore.isEmpty(newSelections)) {
	      underscore.each(newSelections, function (checked, bidId) {
	        var bid = getBidFromId(bidId)

	        if (bid && bid.downloaded) vm.selectedDownloadedBids[bidId] = checked
	      })
	    }
	  }

	  vm.markRequestedBtnDisabled = function markRequestedBtnDisabled() {
	    if (underscore.isEmpty(vm.selectedDownloadedBids)) return true

	    for (var bidId in vm.selectedBids) {
	      if (!(bidId in vm.selectedDownloadedBids) && vm.selectedBids[bidId]) return true
	    }

	    return !underscore.any(vm.selectedDownloadedBids, function (checked) {
	      return checked === true
	    })
	  }

	  vm.markRequested = function markRequested() {
	    var editedBids = []

	    underscore.each(vm.selectedDownloadedBids, function (checked, bidId) {
	      if (!checked) return

	      var bid = getBidFromId(bidId)
	      if (bid) {
	        bid.requested_at = formatDate(new Date())
	        editedBids.push(LcBidRequest.put(bid).$promise)
	      }
	    })

	    if (editedBids.length) {
	      $q.all(editedBids).then(function () {
	        initialize()
	      })
	    }
	  }

	  vm.refreshPage = function refreshPage() {
	    if (!vm.downloadBtnDisabled()) {
	      $timeout(function () {initialize()}, 3000)
	    }
	  }

	  function getBidFromId(bidId) {
	    for (var index = 0; index < vm.bidRequests.length; index++) {
	      var bid = vm.bidRequests[index]
	      if (bid.id === +bidId) return bid
	    }

	    return null
	  }
	}

	__webpack_require__(15)


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module('search-bids', [
	  'customer',
	  'lc-bid-request',
	  'rootApp'
	])

	app.directive('searchBids', searchBidsDirective)

	searchBidsDirective.$inject = []

	function searchBidsDirective() {
	  return {
	    restrict: 'AE',
	    template: __webpack_require__(13),
	    scope: true,
	    bindToController: {
	      onBidsSearched: '&'
	    },
	    controller: 'searchBidsController as searchBids'
	  }
	}

	app.controller('searchBidsController', searchBidsController)
	searchBidsController.$inject = [
	  'LcBidRequest',
	  'underscore',
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency',
	  'resetForm2',
	  'toISODate'
	]
	function searchBidsController(LcBidRequest, underscore, getTypeAheadCustomer, getTypeAheadCurrency, resetForm2,
	  toISODate) {
	  var vm = this //jshint -W040
	  vm.showForm = true

	  init()
	  function init() {
	    vm.searchParams = {
	      pending: false
	    }
	  }

	  vm.toggleShow = function toggleShow(form) {
	    vm.showForm = !vm.showForm

	    if (!vm.showForm) vm.clearForm(form)
	  }

	  vm.validators = {
	    applicant: {
	      test: function () {
	        return underscore.isObject(vm.searchParams.applicant)
	      }
	    },

	    currency: {
	      test: function () {
	        return underscore.isObject(vm.searchParams.currency)
	      }
	    }
	  }
	  vm.getCurrency = getTypeAheadCurrency
	  vm.getApplicant = getTypeAheadCustomer
	  vm.datePickerIsOpen = false
	  vm.openDatePicker = function openDatePicker() {
	    vm.datePickerIsOpen = true
	  }

	  vm.clearForm = function clearForm(form) {
	    resetForm2(form)
	    init()
	  }

	  vm.searchBids = function searchBids(searchParams) {
	    var params = angular.copy(searchParams)
	    params.applicant = params.applicant ? /\d+$/.exec(params.applicant.url)[0] : null
	    params.currency = params.currency ? params.currency.code : null
	    params.created_at = params.created_at ? toISODate(params.created_at) : null

	    if (!params.pending) delete params.pending

	    LcBidRequest.getPaginated(params).$promise.then(function (data) {
	      vm.onBidsSearched({searchResult: data})
	    })
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "<div class=\"search-bids-directive\"><div class=\"search-bid-toggle-show\"><div ng-click=\"searchBids.toggleShow(searchBidsForm)\" class=\"form-m-add-on-toggle clearfix\"><span class=\"form-m-add-on-show-helper\" ng-if=\"searchBids.showForm\"></span><div class=\"form-m-add-on-show-icon form-m-bid-add-on-show-icon\"><span ng-class=\"['glyphicon', {'glyphicon-chevron-down': !searchBids.showForm, 'glyphicon-chevron-up': searchBids.showForm}]\"></span> Search Bids</div></div></div><form class=\"form-horizontal\" name=\"searchBidsForm\" role=\"form\" autocomplete=\"off\" ng-show=\"searchBids.showForm\" ng-submit=\"searchBids.searchBids(searchBids.searchParams)\"><div class=\"form-group form-m-group\" control-has-feedback=\"\"><label for=\"form-m-number\" class=\"control-label col-sm-3\">Form M Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"formMNumber\" ng-model=\"searchBids.searchParams.mf\" id=\"form-m-number\" to-upper=\"\" ng-pattern=\"/(?:mf)?\\d{3,}/i\" maxlength=\"13\"></div></div><div class=\"form-group applicant-group\" control-has-feedback=\"\"><label for=\"applicant\" class=\"control-label col-sm-3\">Applicant</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"applicant\" ng-model=\"searchBids.searchParams.applicant\" id=\"applicant\" ng-minlength=\"3\" ng-pattern=\"searchBids.validators.applicant\" typeahead-min-length=\"3\" uib-typeahead=\"applicant as applicant.name for applicant in searchBids.getApplicant($viewValue)\" typeahead-select-on-blur=\"true\" typeahead-select-on-exact=\"true\"></div></div><div class=\"form-group currency-group\" control-has-feedback=\"\"><label for=\"currency\" class=\"control-label col-sm-3\">Currency</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"currency\" ng-model=\"searchBids.searchParams.currency\" id=\"currency\" maxlength=\"3\" ng-pattern=\"searchBids.validators.currency\" autocomplete=\"off\" uib-typeahead=\"currency as currency.code for currency in searchBids.getCurrency($viewValue)\" typeahead-select-on-blur=\"true\" typeahead-select-on-exact=\"true\"></div></div><div class=\"form-group amount-group\" control-has-feedback=\"\"><label for=\"amount\" class=\"control-label col-sm-3\">Amount</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"amount\" ng-model=\"searchBids.searchParams.amount\" id=\"amount\" number-format=\"\"></div></div><div class=\"form-group created-date-group\" control-has-feedback=\"\" feedback-after=\".input-group-addon\"><label for=\"created-at\" class=\"control-label col-sm-3\">Created At</label><div class=\"col-sm-9\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" name=\"createdAt\" ng-model=\"searchBids.searchParams.created_at\" id=\"created-at\" uib-datepicker-popup=\"dd-MMM-yyyy\" is-open=\"searchBids.datePickerIsOpen\"> <span class=\"input-group-addon\" ng-click=\"searchBids.openDatePicker($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></span></div></div></div><div class=\"form-group lc-number-group\"><label for=\"lc-number\" class=\"control-label col-sm-3\">LC Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"lcNumber\" ng-model=\"searchBids.searchParams.lc_number\" id=\"lc-number\" to-upper=\"\" maxlength=\"16\"></div></div><div class=\"form-group pending-group\"><label for=\"pending\" class=\"control-label col-sm-3\">Pending only</label><div class=\"col-sm-9\"><input type=\"checkbox\" name=\"pending\" ng-model=\"searchBids.searchParams.pending\" id=\"pending\"></div></div><div class=\"form-group submit-group\"><div class=\"col-sm-9 col-sm-offset-3\"><div class=\"clearfix\"><div class=\"pull-left\"><input type=\"submit\" class=\"btn btn-info\" value=\"Search Bids\" ng-disabled=\"searchBidsForm.$invalid\"></div><div class=\"pull-right\" style=\"text-align: right\"><input type=\"button\" class=\"btn btn-warning\" value=\"Clear All\" ng-click=\"searchBids.clearForm(searchBidsForm)\"></div></div></div></div></form></div>";

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = "<div class=\"list-bid-view\"><div class=\"row\" style=\"margin-bottom: 30px; margin-top: 10px\"><div class=\"col-sm-6\"><div search-bids=\"\" on-bids-searched=\"bidHome.onBidsSearched(searchResult)\"></div></div><div class=\"col-sm-6\"><div class=\"action-buttons\" style=\"text-align: right;\"><a class=\"btn btn-success\" ng-href=\"{$bidHome.downloadUrl()$}\" ng-disabled=\"bidHome.downloadBtnDisabled()\" ng-click=\"bidHome.refreshPage()\">Download</a> <button type=\"button\" name=\"bid-home-mark-as-requested-btn\" class=\"btn btn-success\" ng-click=\"bidHome.markRequested()\" ng-disabled=\"bidHome.markRequestedBtnDisabled()\">Mark as requested</button></div></div></div><div display-pending-bid=\"\" pending-bids=\"bidHome.bidRequests\" pager-object=\"bidHome.paginationHooks\" update-collection=\"bidHome.getBidsOnNavigation(linkUrl)\" pagination-size=\"20\" selected-bids=\"bidHome.selectedBids\" on-selected-bids-changed=\"bidHome.onSelectedBidsChanged(newSelections)\" on-row-dbl-click=\"bidHome.rowDblClickCb(bid)\" table-caption=\"bidHome.tableCaption\"></div></div>";

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var lcAppCommons = __webpack_require__(5)

	var app = angular.module('form-m-bids')

	app.directive('displayPendingBid', displayPendingBidDirective)
	function displayPendingBidDirective() {
	  return {
	    restrict: 'EA',

	    templateUrl: lcAppCommons.buildUrl('form-m/bids/display-pending-bid/display-pending-bid.html'),

	    scope: true,

	    bindToController: {
	      bids: '=pendingBids',

	      updateCollection: '&',

	      onSelectedBidsChanged: '&',

	      pager: '=pagerObject',

	      onDblClick: '&onRowDblClick',

	      paginationSize: '=',

	      selectedBids: '='
	    },

	    controller: 'displayPendingBidDirectiveCtrl as bidTable'
	  }
	}

	app.controller('displayPendingBidDirectiveCtrl', displayPendingBidDirectiveCtrl)

	displayPendingBidDirectiveCtrl.$inject = [
	  'pagerNavSetUpLinks',
	  '$scope',
	  'underscore'
	]

	function displayPendingBidDirectiveCtrl(pagerNavSetUpLinks, scope, underscore) {
	  var vm = this //jshint -W040

	  vm.selectedBids = {}

	  function setUpLinks(next, prev, count) {
	    vm.count = count
	    var numLinks = Math.ceil(count / vm.paginationSize)

	    var linkProperties = pagerNavSetUpLinks(next, prev, numLinks)

	    vm.nextPageLink = next
	    vm.prevPageLink = prev

	    vm.linkUrls = linkProperties.linkUrls
	    vm.currentLink = linkProperties.currentLink

	    /**
	     * The row index offset. The row begin at one so in the view, we do `$index + 1` for row number. However, as we
	     * move from page to page, the `$index` view value is reset back to zero, so that row number always begin at 1.
	     * Since we know what the page number is (this.currentLink), we calculate the offset for the row (as an arithmetic
	     * progression)
	     * @type {number}
	     */
	    vm.rowIndexOffset = (vm.currentLink - 1) * vm.paginationSize
	  }

	  vm.onUpdateCollection = onUpdateCollection
	  function onUpdateCollection(linkUrl) {
	    vm.updateCollection({linkUrl: linkUrl})
	  }

	  scope.$watch(function getPager() {return vm.pager}, function updatedPager(pager) {
	    if (pager && !underscore.isEmpty(pager)) {
	      setUpLinks(pager.next, pager.previous, pager.count)
	    }
	  })

	  function deselectAllBids() {
	    vm.bids.forEach(function (bid) {
	      bid.highlighted = false
	    })
	  }

	  vm.modelRowClicked = modelRowClicked
	  function modelRowClicked(model) {
	    if (!model.downloaded) {
	      deselectAllBids()

	      //only highlight a row if no row is checked and the row model is not downloaded previously
	      model.highlighted = !underscore.any(vm.bids, function (bid) {
	        return bid.checked
	      })
	    }
	  }

	  vm.onRowDblClick = function onRowDblClick(bid) {
	    vm.onDblClick({bid: bid})
	  }

	  scope.$watch(function getSelectedBids() {return vm.selectedBids}, function updatedSelectedBids(selectedBids) {
	    vm.onSelectedBidsChanged({newSelections: selectedBids})

	    if (selectedBids && !underscore.isEmpty(selectedBids)) {

	      underscore.each(selectedBids, function (checked, id) {

	        for (var bidIndex = 0; bidIndex < vm.bids.length; bidIndex++) {
	          var bid = vm.bids[bidIndex]
	          if (bid.id === +id) {
	            bid.checked = checked
	          }
	        }

	      })

	      vm.toggleAll = underscore.all(vm.bids, function (bid) {
	        return bid.checked === true
	      })
	    }
	  }, true)

	  vm.toggleAll = false

	  vm.toggleAllClicked = function toggleAllClicked() {
	    vm.bids.forEach(function (bid) {
	      vm.selectedBids[bid.id] = !bid.requested_at && vm.toggleAll
	    })
	  }
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	var app = angular.module('list-form-m',
	  ['rootApp',
	   'ui.router',
	   'form-m-service',
	   'search-form-m',
	   'model-table',
	   'customer',
	   'add-form-m'
	  ])

	app.config(formMListURLConfig)
	formMListURLConfig.$inject = ['$stateProvider']
	function formMListURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m.list', {
	      kanmiiTitle: 'Form M List',

	      views: {
	        'listFormM': {
	          template: __webpack_require__(17),

	          controller: 'FormMListController as formMList'
	        }
	      }
	    })
	}

	app.controller('FormMListController', FormMListController)
	FormMListController.$inject = ['FormM', '$scope', 'formMModelManager', '$http']
	function FormMListController(FormM, scope, formMModelManager, $http) {
	  var vm = this

	  /**
	   * The model manager will be used by the 'model-table' directive to manage the collection of form Ms retrieved
	   * from the server
	   * @type {[]}
	   */
	  vm.modelManager = formMModelManager

	  vm.modelRowDblClick = function modelRowDblClick(formM) {
	    scope.goToFormM(formM.number)
	  }

	  /**
	   * Update the form Ms collection and pagination hooks
	   * @param {object} data
	   */
	  function updateFormMs(data) {
	    vm.formMs = data.results

	    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
	  }

	  vm.updateFormMs = updateFormMs

	  /**
	   * The object containing the hooks for paging through the form Ms collection
	   * @type {Array}
	   */
	  vm.paginationHooks = []

	  /**
	   * The form Ms retrieved from backend. Will contain a list of form Ms and pagination hooks for
	   * retrieving the next and previous sets of form Ms. This model is used by the display directive
	   * to display the form Ms in a table
	   * @type {[]}
	   */
	  vm.formMs = []
	  FormM.getNoLcAttached().$promise.then(function (data) {
	    updateFormMs(data)
	  })

	  /**
	   * The table caption for the 'model-table' directive
	   * @type {string}
	   */
	  vm.tableCaption = 'Form M'

	  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
	  /**
	   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
	   * @param {string} linkUrl - the url (href) of the link clicked by user
	   */
	  function getFormMCollectionOnNavigation(linkUrl) {
	    $http.get(linkUrl).then(function (response) {
	      updateFormMs(response.data)
	    })
	  }

	  /**
	   * When the search-form-m directive returns, the result is propagated into this model
	   * @type {null|object}
	   */
	  vm.searchedFormMResult = null

	  scope.$watch(function getNewFormM() {return vm.searchedFormMResult}, function (searchedFormMResult) {
	    if (searchedFormMResult) updateFormMs(searchedFormMResult)
	  })
	}


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div class=\"manage-form-m-tab-content\"><div class=\"row\" style=\"margin-bottom: 30px; margin-top: 10px\"><div class=\"col-sm-6\"><div search-mf=\"\" on-mf-search=\"formMList.updateFormMs(searchResult)\"></div></div></div><div model-table=\"\" model-collection=\"formMList.formMs\" table-model-manager=\"::formMList.modelManager\" table-caption=\"::formMList.tableCaption\" pagination-size=\"20\" update-collection=\"formMList.getFormMCollectionOnNavigation(linkUrl)\" pager-object=\"formMList.paginationHooks\" on-row-dbl-click-callback=\"formMList.modelRowDblClick(rowModel)\"></div></div>";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('search-detailed-or-uploaded-form-m', [
	  'upload-form-m-service',
	  'toggle-dim-element',
	  'form-m-service'
	])

	app.factory('SearchDetailedOrUploadedFormMService', SearchDetailedOrUploadedFormMService)
	SearchDetailedOrUploadedFormMService.$inject = [
	  'UploadFormM',
	  'xhrErrorDisplay',
	  'ModalService',
	  'underscore',
	  '$q',
	  'FormM'
	]
	function SearchDetailedOrUploadedFormMService(UploadFormM, xhrErrorDisplay, ModalService, underscore, $q, FormM) {

	  function searchFormM(submittedSearchParams) {
	    var deferred = $q.defer()
	    var mf = submittedSearchParams.mf.trim()

	    FormM.getPaginated({number: mf}).$promise.then(function (data) {
	      if (data.count === 1) {
	        deferred.resolve({number: data.results[0].number})

	      } else UploadFormM.query({mf: mf}).$promise.then(searchFormMSuccess, searchFormMError)

	    }, searchFormMError)

	    function searchFormMSuccess(data) {
	      deferred.resolve({singleWinFormMs: data})
	    }

	    function searchFormMError(xhr) {
	      xhrErrorDisplay(xhr)
	      deferred.reject(xhr)
	    }

	    return deferred.promise
	  }

	  function SearchService() {
	    var service = this

	    service.searchWithModal = searchWithModal
	    function searchWithModal() {
	      var deferred = $q.defer()

	      ModalService.showModal({
	        templateUrl: __webpack_require__(5).buildUrl(
	          'form-m/search-detailed-or-uploaded-form-m/search-detailed-or-uploaded-form-m-modal.html'),

	        controller: 'SearchDetailedOrUploadedFormMServiceModalCtrl as searchUploadedFormMModal'
	      }).then(function (modal) {
	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 500,
	          title: 'Search Form M',

	          close: function () {
	            modal.controller.close()
	          }
	        })

	        modal.close.then(function (submittedSearchParams) {
	          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !underscore.isEmpty(submittedSearchParams)) {
	            deferred.resolve(searchFormM(submittedSearchParams))
	          }
	        })
	      })

	      return deferred.promise
	    }
	  }

	  return new SearchService()
	}

	app.controller('SearchDetailedOrUploadedFormMServiceModalCtrl', SearchDetailedOrUploadedFormMServiceModalCtrl)
	SearchDetailedOrUploadedFormMServiceModalCtrl.$inject = [
	  'close',
	  'resetForm',
	  '$element'
	]
	function SearchDetailedOrUploadedFormMServiceModalCtrl(close, resetForm, element) {
	  var vm = this

	  initForm()
	  function initForm() {
	    vm.searchParams = {}
	  }

	  vm.close = close

	  vm.reset = reset
	  function reset(form) {
	    resetForm(form, element, '.form-control', initForm)
	    form.$invalid = false
	    form.$error = {}
	  }
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module('search-form-m', [
	  'customer',
	  'form-m-service',
	  'rootApp',
	  'complex-object-validator'
	])

	app.directive('searchMf', searchMfDirective)

	searchMfDirective.$inject = []

	  function searchMfDirective() {
	  return {
	    restrict: 'AE',
	    template: __webpack_require__(20),
	    scope: true,
	    bindToController: {
	      onMfSearch: '&'
	    },
	    controller: 'searchFormMController as searchMf'
	  }
	}

	app.controller('searchFormMController', searchFormMController)
	searchFormMController.$inject = [
	  'FormM',
	  'underscore',
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency',
	  'resetForm2',
	  'toISODate'
	]
	function searchFormMController(FormM, underscore, getTypeAheadCustomer, getTypeAheadCurrency, resetForm2,
	  toISODate) {
	  var vm = this //jshint -W040
	  vm.showForm = true

	  init()
	  function init() {
	    vm.searchParams = {
	      cancelled: false
	    }
	  }

	  vm.toggleShow = function toggleShow(form) {
	    vm.showForm = !vm.showForm

	    if (!vm.showForm) vm.clearForm(form)
	  }

	  vm.getCurrency = getTypeAheadCurrency
	  vm.getApplicant = getTypeAheadCustomer
	  vm.datePickerIsOpen = false
	  vm.openDatePicker = function openDatePicker() {
	    vm.datePickerIsOpen = true
	  }

	  vm.clearForm = function clearForm(form) {
	    resetForm2(form)
	    init()
	  }

	  vm.searchMf = function searchMf(searchParams) {
	    var params = angular.copy(searchParams)
	    params.applicant_id = params.applicantObj ? /\d+$/.exec(params.applicantObj.url)[0] : null
	    params.currency = params.currency ? params.currency.code : null
	    params.created_at = params.created_at ? toISODate(params.created_at) : null

	    if (!params.cancelled) delete params.cancelled

	    FormM.getPaginated(params).$promise.then(function (data) {
	      vm.onMfSearch({searchResult: data})
	    })
	  }
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"search-mf-directive\"><div class=\"search-mf-toggle-show\"><div ng-click=\"searchMf.toggleShow(searchMfForm)\" class=\"form-m-add-on-toggle clearfix\"><span class=\"form-m-add-on-show-helper\" ng-if=\"searchMf.showForm\"></span><div class=\"form-m-add-on-show-icon\"><span ng-class=\"['glyphicon', {'glyphicon-chevron-down': !searchMf.showForm, 'glyphicon-chevron-up': searchMf.showForm}]\"></span> Search Form M</div></div></div><form class=\"form-horizontal\" name=\"searchMfForm\" role=\"form\" autocomplete=\"off\" ng-show=\"searchMf.showForm\" ng-submit=\"searchMf.searchMf(searchMf.searchParams)\"><div class=\"form-group form-m-number-group\" control-has-feedback=\"\"><label for=\"form-m-number\" class=\"control-label col-sm-3\">Form M Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"formMNumber\" ng-model=\"searchMf.searchParams.number\" id=\"form-m-number\" to-upper=\"\" ng-pattern=\"/(?:mf)?\\d{3,}/i\" maxlength=\"13\"></div></div><div class=\"form-group applicant-group\" control-has-feedback=\"\"><label for=\"applicant\" class=\"control-label col-sm-3\">Applicant</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"applicant\" ng-model=\"searchMf.searchParams.applicantObj\" id=\"applicant\" ng-minlength=\"3\" autocomplete=\"off\" typeahead-min-length=\"3\" uib-typeahead=\"applicant as applicant.name for applicant in searchMf.getApplicant($viewValue)\" typeahead-select-on-blur=\"true\" typeahead-select-on-exact=\"true\"></div></div><div class=\"form-group currency-group\" control-has-feedback=\"\"><label for=\"currency\" class=\"control-label col-sm-3\">Currency</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"currency\" ng-model=\"searchMf.searchParams.currency\" id=\"currency\" maxlength=\"3\" autocomplete=\"off\" uib-typeahead=\"currency as currency.code for currency in searchMf.getCurrency($viewValue)\" typeahead-select-on-blur=\"true\" typeahead-select-on-exact=\"true\"></div></div><div class=\"form-group amount-group\" control-has-feedback=\"\"><label for=\"amount\" class=\"control-label col-sm-3\">Amount</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"amount\" ng-model=\"searchMf.searchParams.amount\" id=\"amount\" number-format=\"\"></div></div><div class=\"form-group created-date-group\" control-has-feedback=\"\" feedback-after=\".input-group-addon\"><label for=\"created-at\" class=\"control-label col-sm-3\">Created At</label><div class=\"col-sm-9\"><div class=\"input-group\"><input type=\"text\" class=\"form-control\" name=\"createdAt\" ng-model=\"searchMf.searchParams.created_at\" id=\"created-at\" uib-datepicker-popup=\"dd-MMM-yyyy\" is-open=\"searchMf.datePickerIsOpen\"> <span class=\"input-group-addon\" ng-click=\"searchMf.openDatePicker($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></span></div></div></div><div class=\"form-group lc-number-group\"><label for=\"lc-number\" class=\"control-label col-sm-3\">LC Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" name=\"lcNumber\" ng-model=\"searchMf.searchParams.lc_number\" id=\"lc-number\" to-upper=\"\" maxlength=\"16\"></div></div><div class=\"form-group cancelled-group\"><label for=\"cancelled\" class=\"control-label col-sm-3\">Include cancelled</label><div class=\"col-sm-9\"><input type=\"checkbox\" name=\"cancelled\" ng-model=\"searchMf.searchParams.cancelled\" id=\"cancelled\"></div></div><div class=\"form-group submit-group\"><div class=\"col-sm-9 col-sm-offset-3\"><div class=\"clearfix\"><div class=\"pull-left\"><input type=\"submit\" class=\"btn btn-info\" value=\"Search Form M\" ng-disabled=\"searchMfForm.$invalid\"></div><div class=\"pull-right\" style=\"text-align: right\"><input type=\"button\" class=\"btn btn-warning\" value=\"Clear All\" ng-click=\"searchMf.clearForm(searchMfForm)\"></div></div></div></div></form></div>";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	/*jshint camelcase:false*/

	__webpack_require__(22)

	var rootCommons = __webpack_require__(7)

	var app = angular.module('upload-form-m',
	  ['rootApp',
	    'ui.router',
	    'upload-form-m-service',
	    'kanmii-underscore'
	  ])

	app.config(rootCommons.interpolateProviderConfig)

	app.config(uploadFormMURLConfig)
	uploadFormMURLConfig.$inject = ['$stateProvider']
	function uploadFormMURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m.upload', {
	      kanmiiTitle: 'Form M Upload',

	      views: {
	        'uploadFormM': {
	          template: __webpack_require__(23),

	          controller: 'UploadFormMController as uploadFormM'
	        }
	      }
	    })
	}

	app.controller('UploadFormMController', UploadFormMController)
	UploadFormMController.$inject = ['UploadFormM', 'xhrErrorDisplay', 'kanmiiUnderscore', '$scope']

	function UploadFormMController(UploadFormM, xhrErrorDisplay, kanmiiUnderscore, $scope) {
	  var vm = this
	  vm.datePrompt = 'Date must be in format dd-mm-yyyy e.g 31-01-2015'

	  initial()
	  function initial(form) {
	    vm.formMShowIndicator = false
	    vm.indicateError = false
	    vm.formMIsUploading = false
	    vm.uploadIndicationText = 'Uploading Form Ms.........please wait'
	    vm.uploadFormMText = ''

	    if (form) {
	      form.$setPristine()
	      form.$setUntouched()
	    }
	  }

	  function doDismiss() {
	    vm.formMShowIndicator = false
	    if (vm.formMIsUploading) initial($scope.uploadFormMForm)
	  }

	  vm.dismissIndicator = function dismissIndicator() {
	    doDismiss()
	  }

	  vm.uploadFormM = function uploadFormM(text) {
	    vm.formMIsUploading = true
	    vm.formMShowIndicator = true
	    var uploaded = {}
	    var row
	    var mf
	    var formM
	    var ba
	    var dt

	    function parseDate(dt) {
	      var regExp = /(\d{2})\D(\d{1,2})\D(\d{4})/
	      var exec = regExp.exec(dt)

	      if (!exec) return null

	      var month = +exec[2].trim()

	      if (month > 12) return null

	      return exec[3] + '-' + month + '-' + exec[1]
	    }

	    try {
	      Papa.parse(text, {
	        delimiter: '\t',
	        header: true,
	        step: function (data) {
	          row = data.data[0]
	          mf = row['MF NUM'].trim()
	          ba = row['BA NUM'].trim()
	          dt = parseDate(row['DATE SUBMITTED'])

	          if (!dt) throw new Error('Error in form M date: "' + mf + '"\n' + vm.datePrompt)

	          formM = {
	            ba: ba,
	            mf: mf,
	            ccy: row.CURRENCY.trim(),
	            applicant: row['APPLICANT NAME'].trim(),
	            fob: row.FOB.replace(/[,\s]/g, ''),
	            cost_freight: row['COST AND FREIGHT'].replace(/[,\s]/g, ''),
	            submitted_at: dt,
	            validated_at: dt,
	            goods_description: row.DESCS.trim()
	          }

	          if (kanmiiUnderscore.has(uploaded, mf)) {
	            if (row.STAX.trim() === 'Validated') {
	              formM.submitted_at = uploaded[mf].submitted_at
	              uploaded[mf] = formM

	            } else if (row.STAX.trim() === 'Submitted') uploaded[mf].submitted_at = formM.submitted_at

	          } else {
	            if (ba.length === 16) uploaded[mf] = formM
	          }
	        }
	      })
	    } catch (e) {
	      vm.formMIsUploading = false
	      vm.indicateError = true
	      vm.uploadIndicationText = e.message
	      return
	    }

	    var uploaded1 = kanmiiUnderscore.values(uploaded)
	    UploadFormM.save({uploaded: uploaded1, likely_duplicates: true})
	      .$promise.then(formMCreatedSuccess, formMCreatedError)

	    function formMCreatedSuccess(data) {
	      var creationResult = data.created_data,
	        numCreatedNow = creationResult.length,
	        numCreatedPreviously = uploaded1.length - numCreatedNow

	      vm.uploadIndicationText = 'Done Uploading form Ms\n======================\n' +
	        'Total new form Ms created: ' + numCreatedNow + '\n'
	      if (numCreatedPreviously) {
	        vm.uploadIndicationText += ('Total not created (uploaded previously): ' + numCreatedPreviously)
	      }
	    }

	    function formMCreatedError(xhr) {
	      vm.formMIsUploading = false
	      vm.indicateError = true
	      vm.uploadIndicationText = 'Error uploading form!'
	      xhrErrorDisplay(xhr)
	    }
	  }
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('search-uploaded-form-m', [
	  'kanmii-underscore',
	  'upload-form-m-service',
	  'toggle-dim-element'
	])

	app.factory('SearchUploadedFormMService', SearchUploadedFormMService)
	SearchUploadedFormMService.$inject = [
	  'UploadFormM',
	  'xhrErrorDisplay',
	  'ModalService',
	  'kanmiiUnderscore',
	  '$q'
	]
	function SearchUploadedFormMService(UploadFormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q) {

	  function searchFormM(submittedSearchParams) {
	    var deferred = $q.defer()
	    var searchParams = angular.copy(submittedSearchParams)

	    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
	    if (searchParams.currency) searchParams.currency = searchParams.currency.code

	    UploadFormM.query(searchParams).$promise.then(searchFormMSuccess, searchFormMError)

	    function searchFormMSuccess(data) {
	      deferred.resolve(data)
	    }

	    function searchFormMError(xhr) {
	      xhrErrorDisplay(xhr)
	      deferred.reject(xhr)
	    }

	    return deferred.promise
	  }

	  function SearchService() {
	    var service = this

	    service.searchWithModal = searchWithModal
	    function searchWithModal() {
	      var deferred = $q.defer()

	      ModalService.showModal({
	        templateUrl: __webpack_require__(5).buildUrl(
	          'form-m/upload-form-m/search-uploaded-form-m/search-uploaded-form-m-modal.html'),

	        controller: 'SearchUploadedFormMServiceModalCtrl as searchUploadedFormMModal'
	      }).then(function(modal) {
	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 600,
	          minHeight: 250,
	          title: 'Search Uploaded Form M',

	          close: function() {
	            modal.close.then()
	          }
	        })

	        modal.close.then(function(submittedSearchParams) {
	          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
	            deferred.resolve(searchFormM(submittedSearchParams))
	          }
	        })
	      })

	      return deferred.promise
	    }
	  }

	  return new SearchService()
	}

	app.controller('SearchUploadedFormMServiceModalCtrl', SearchUploadedFormMServiceModalCtrl)
	SearchUploadedFormMServiceModalCtrl.$inject = [
	  'close',
	  'resetForm',
	  '$element'
	]
	function SearchUploadedFormMServiceModalCtrl(close, resetForm, element) {
	  var vm = this

	  initForm()
	  function initForm() {
	    vm.searchParams = {}
	  }

	  vm.close = close

	  vm.reset = reset
	  function reset(form) {
	    resetForm(form, element, '.form-control', initForm)
	    form.$invalid = false
	    form.$error = {}
	  }

	  vm.submitSearchParams = submitSearchParams
	  function submitSearchParams(searchParams) {
	    close(searchParams)
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div class=\"upload-form-m-tab-content\" ng-keypress=\"uploadFormM.dismissIndicatorEvent($event)\"><form class=\"upload-form-m-form\" role=\"form\" name=\"uploadFormMForm\" ng-submit=\"uploadFormM.uploadFormM(uploadFormM.uploadFormMText, uploadFormMForm)\"><div class=\"form-group upload-form-m-text-group\"><pre ng-class=\"['upload-form-m-indicator', {'error-indicator': uploadFormM.indicateError}]\" ng-show=\"uploadFormM.formMShowIndicator\">{$uploadFormM.uploadIndicationText$}\r\n        <span class=\"dismiss\" data-toggle=\"tooltip\" title=\"Dismiss\" ng-click=\"uploadFormM.dismissIndicator()\">x</span>\r\n      </pre><label for=\"upload-form-m\" class=\"control-label\">{$uploadFormM.datePrompt$}</label> <textarea name=\"upload-form-m\" id=\"upload-form-m\" required=\"\" ng-model=\"uploadFormM.uploadFormMText\" ng-class=\"['form-control', 'upload-form-m', {'form-m-is-uploading':uploadFormM.formMIsUploading}]\" ng-readonly=\"uploadFormM.formMIsUploading\"></textarea></div><div class=\"upload-form-m-submit\" style=\"text-align: center\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploadFormMForm.$invalid || uploadFormM.formMIsUploading\">Upload</button></div></form></div>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('display-uploaded-form-m', [
	  'rootApp',
	  'model-table',
	  'upload-form-m-service'
	])

	app.factory('DisplayUploadedFormMModal', DisplayUploadedFormMModal)
	DisplayUploadedFormMModal.$inject = ['$q', 'ModalService']
	function DisplayUploadedFormMModal($q, ModalService) {
	  function DisplayService() {
	    this.display = display

	    function display(forMData) {
	      var deferred = $q.defer()

	      ModalService.showModal({
	        template: __webpack_require__(25),
	        controller: 'DisplayUploadedFormMModalCtrl as displayUploadedFormMModal',
	        inputs: {forMData: forMData}
	      }).then(function (modal) {
	        var ctrl = modal.controller

	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 750,
	          title: ctrl.tableCaption,

	          close: function () {
	            ctrl.close()
	          }
	        })

	        modal.close.then(function (formM) {
	          deferred.resolve(formM)
	        })
	      })

	      return deferred.promise
	    }
	  }

	  return new DisplayService()
	}

	app.controller('DisplayUploadedFormMModalCtrl', DisplayUploadedFormMModalCtrl)
	DisplayUploadedFormMModalCtrl.$inject = [
	  'close',
	  'forMData',
	  'uploadedFormMModelManager'
	]
	function DisplayUploadedFormMModalCtrl(close, forMData, uploadedFormMModelManager) {
	  var vm = this

	  vm.forMData = forMData
	  vm.tableCaption = 'Single Window Forms M'
	  vm.modelManager = uploadedFormMModelManager
	  vm.close = close
	}


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div class=\"display-uploaded-form-m-modal-root\"><div model-table=\"\" model-collection=\"displayUploadedFormMModal.forMData\" table-model-manager=\"::displayUploadedFormMModal.modelManager\" table-caption=\"::displayUploadedFormMModal.tableCaption\" on-row-dbl-click-callback=\"displayUploadedFormMModal.close(rowModel)\" show-pagination=\"false\"></div></div>";

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-m-home-view\"><div uib-tabset=\"\"><div uib-tab=\"\" ng-repeat=\"(key, tab) in tabs\" heading=\"{$tab.title$}\" active=\"tab.active\" select=\"tab.select()\" ng-attr-class=\"{$tab.className$}\"><div class=\"\" ui-view=\"{$tab.viewName$}\"></div></div></div></div>";

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var rootCommons = __webpack_require__(7)

	var app = angular.module('lc', [
	  'ui.router',
	  'model-table',
	  'rootApp',
	  'search-lc',
	  'lc-detail'
	])

	app.config(rootCommons.interpolateProviderConfig)

	app.config(bidURLConfig)
	bidURLConfig.$inject = ['$stateProvider']
	function bidURLConfig($stateProvider) {
	  $stateProvider
	    .state('lc', {
	      url: '/lc',

	      kanmiiTitle: 'Letter of credit',

	      templateUrl: __webpack_require__(5).buildUrl('lc/lc.html'),

	      controller: 'LetterOfCreditController as lcHome'
	    })
	}

	app.controller('LetterOfCreditController', LetterOfCreditController)
	LetterOfCreditController.$inject = ['SearchLc', '$state']
	function LetterOfCreditController(SearchLc, $state) {
	  var vm = this

	  vm.searchLc = function searchLc() {
	    SearchLc.searchWithModal().then(function(data) {
	      var results = data.results

	      if (results.length) {
	        if (results.length === 1) {
	          var lc = results[0]
	          $state.go('lc_detail', {lc_number: lc.lc_number, lc: lc})
	        }
	      }
	    })
	  }
	}


	__webpack_require__(28)
	__webpack_require__(29)


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var rootCommons = __webpack_require__(7)

	var app = angular.module('lc-detail', [
	  'ui.router',
	  'rootApp',
	  'lc-service',
	  'lc-issue-service',
	  'kanmii-underscore',
	  'customer'
	])

	app.config(rootCommons.interpolateProviderConfig)

	app.config(bidURLConfig)

	bidURLConfig.$inject = ['$stateProvider']

	function bidURLConfig($stateProvider) {
	  $stateProvider
	    .state('lc_detail', {
	      url: '/lc/:lc_number',

	      params: {lc: null},

	      kanmiiTitle: 'Letter of credit',

	      templateUrl: __webpack_require__(5).buildUrl('lc/lc-detail/lc-detail.html'),

	      controller: 'LetterOfCreditDetailController as lcDetail'
	    })
	}

	app.controller('LetterOfCreditDetailController', LetterOfCreditDetailController)

	LetterOfCreditDetailController.$inject = [
	  '$stateParams',
	  'LetterOfCredit',
	  '$state',
	  'getTypeAheadCustomer',
	  '$filter',
	  'getTypeAheadLCIssue',
	  'LCIssueConcrete',
	  'kanmiiUnderscore',
	  'xhrErrorDisplay',
	  'formatDate',
	  'Customer',
	  'formMAttributesVerboseNames'
	]

	function LetterOfCreditDetailController($stateParams, LetterOfCredit, $state, getTypeAheadCustomer, $filter,
	  getTypeAheadLCIssue, LCIssueConcrete, kanmiiUnderscore, xhrErrorDisplay, formatDate, Customer,
	  formMAttributesVerboseNames) {
	  var vm = this

	  initialize()

	  function initialize() {
	    if ($stateParams.lc) {
	      vm.lc = $stateParams.lc
	      vm.lcIssues = getIssuesNotClosed(vm.lc.issues)
	    }

	    else {
	      LetterOfCredit.getPaginated({lc_number: $stateParams.lc_number}).$promise.then(function(data) {
	        if (data.count) {
	          vm.lc = data.results[0]
	          vm.lcIssues = getIssuesNotClosed(vm.lc.issues)
	        }

	        else $state.go('lc')
	      })
	    }

	    vm.lcForm = {}
	    vm.alertIsShown = false
	    vm.issue = {}

	    function getIssuesNotClosed(issues) {
	      if (!issues) return []

	      return issues.filter(function(issue) {
	        return !issue.closed_at
	      })
	    }
	  }

	  vm.issueDateGetterSetter = function issueDateGetterSetter() {
	    if (vm.lc && vm.lc.estb_date) return $filter('date')(vm.lc.estb_date, 'dd-MMM-yyyy')
	  }

	  vm.expiryDateGetterSetter = function expiryDateGetterSetter() {
	    if (vm.lc && vm.lc.expiry_date) return $filter('date')(vm.lc.expiry_date, 'dd-MMM-yyyy')
	  }

	  vm.saveIssue = function saveIssue(issue, form) {
	    if (issue && !kanmiiUnderscore.isEmpty(issue)) {
	      var postData = {
	        issue: issue.issue.url,
	        mf: vm.lc.mf,
	        lc_number: vm.lc.lc_number,
	        get_or_create_form_m: true
	      }

	      var applicant = issue.applicant

	      if (applicant && !kanmiiUnderscore.isEmpty(applicant)) {
	        postData.form_m_data = {
	          applicant: applicant.url,
	          currency: vm.lc.ccy_data.url,
	          amount: vm.lc.lc_amt_org_ccy,
	          lc: vm.lc.url,
	          number: vm.lc.mf
	        }

	      }

	      LCIssueConcrete.save(postData).$promise.then(saveSuccess, saveError)
	    }

	    function saveSuccess(data) {
	      vm.lcIssues.unshift({
	        issue_text: data.issue_text,
	        issue: data.issue,
	        id: data.id,
	        mf: data.mf
	      })

	      vm.issue = {}

	      if (!vm.lc.applicant_data) { vm.lc.applicant_data = applicant}
	      form.$setPristine()
	      form.$setUntouched()
	    }

	    function saveError(xhr) {
	      var transform = null
	      if (xhr.data.form_m_creation_errors) {
	        transform = formMAttributesVerboseNames
	        delete xhr.data.form_m_creation_errors
	      }
	      xhrErrorDisplay(xhr, transform)
	    }

	  }

	  vm.closeIssue = function closeIssue(issue) {
	    issue.closed_at = formatDate(new Date())
	    LCIssueConcrete.put(issue).$promise.then(function() {

	      vm.lcIssues = vm.lcIssues.filter(function(anIssue) {
	        return anIssue.id !== issue.id
	      })

	    }, function(xhr) {
	      xhrErrorDisplay(xhr)
	    })
	  }

	  vm.replaceLc = function replaceLc(newLcNumber) {
	    LetterOfCredit.getPaginated({lc_number: newLcNumber}).$promise.then(function(data) {
	      if (data.count) {
	        var lc = data.results[0]

	        $state.go('.', {lc_number: lc.lc_number, lc: lc})

	      } else vm.alertIsShown = true
	    })
	  }

	  vm.replaceLcFormInvalid = function replaceLcFormInvalid(formInvalid, newLcNumber) {
	    return formInvalid || vm.lc.lc_number.toLowerCase().indexOf(newLcNumber.toLowerCase()) !== -1
	  }

	  vm.customerAdded = function customerAdded(customer) {
	    vm.issue.applicant = customer
	  }

	  vm.getApplicant = getTypeAheadCustomer

	  vm.getIssue = function getIssue(text) {
	    return getTypeAheadLCIssue({text: text, exclude_form_m_issues: vm.lc.mf})
	  }

	  vm.addCustomer = function addCustomer() {
	    Customer.save({name: vm.lc.applicant}).$promise.then(function(data) {
	      vm.issue.applicant = data
	      vm.lc.applicant_data = data
	    })
	  }

	  vm.closeAlert = function closeAlert() {
	    vm.alertIsShown = false
	  }
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('search-lc', [
	  'kanmii-underscore',
	  'toggle-dim-element',
	  'form-m-service',
	  'lc-service'
	])

	app.factory('SearchLc', SearchLc)
	SearchLc.$inject = [
	  'xhrErrorDisplay',
	  'ModalService',
	  'kanmiiUnderscore',
	  '$q',
	  'ToggleDimElement',
	  'LetterOfCredit'
	]
	function SearchLc(xhrErrorDisplay, ModalService, kanmiiUnderscore, $q, ToggleDimElement, LetterOfCredit) {

	  function searchLc(submittedSearchParams) {
	    var deferred = $q.defer()
	    var searchParams = angular.copy(submittedSearchParams)

	    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
	    if (searchParams.currency) searchParams.currency = searchParams.currency.code

	    LetterOfCredit.getPaginated(searchParams).$promise.then(searchLcSuccess, searchLcError)

	    function searchLcSuccess(data) {
	      deferred.resolve(data)
	    }

	    function searchLcError(xhr) {
	      xhrErrorDisplay(xhr)
	      deferred.reject(xhr)
	    }

	    return deferred.promise
	  }

	  function SearchService() {
	    var service = this

	    service.searchWithModal = searchWithModal
	    function searchWithModal(config) {
	      var deferred = $q.defer()
	      config = config || {}

	      ModalService.showModal({
	        templateUrl: __webpack_require__(5).buildUrl('lc/search-lc/search-lc.html'),
	        controller: 'SearchLcModalCtrl as searchLcModal',
	        inputs: {
	          uiOptions: config.uiOptions
	        }

	      }).then(function(modal) {
	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 600,
	          minHeight: 450,
	          title: 'Search Letter of credit',

	          open: function() {
	            config.dim && ToggleDimElement.dim(config.parent, config.dimCb)
	          },

	          close: function() {
	            config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb)
	          }
	        })

	        modal.close.then(function(submittedSearchParams) {
	          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
	            deferred.resolve(searchLc(submittedSearchParams))
	          }

	          config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb)
	        })
	      })

	      return deferred.promise
	    }
	  }

	  return new SearchService()
	}

	app.controller('SearchLcModalCtrl', SearchLcModalCtrl)
	SearchLcModalCtrl.$inject = [
	  'close',
	  'resetForm',
	  '$element',
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency'
	]
	function SearchLcModalCtrl(close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
	  var vm = this

	  initForm()
	  function initForm() {
	    vm.searchParams = {}
	  }

	  vm.close = close

	  vm.reset = reset
	  function reset(form) {
	    resetForm(form, element, '.form-control', initForm)
	    form.$invalid = false
	    form.$error = {}
	  }

	  vm.submitSearchParams = submitSearchParams
	  function submitSearchParams(searchParams) {
	    close(searchParams)
	  }

	  vm.getApplicant = getTypeAheadCustomer
	  vm.getCurrency = getTypeAheadCurrency
	}


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-m-home-view\"><div class=\"form-m-home-action-buttons btn-group-vertical\" role=\"group\"><a class=\"btn btn-info form-m-home-action-button\" ui-sref=\"lc\">Letter of credit</a> <a class=\"btn btn-info form-m-home-action-button\" ui-sref=\"form_m\">Form M</a></div></div>";

/***/ }
/******/ ]);