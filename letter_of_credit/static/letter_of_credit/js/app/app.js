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
	__webpack_require__(22)

	var rootCommons = __webpack_require__(6)

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

	      template: __webpack_require__(25)
	    })
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	/*jshint camelcase:false*/

	__webpack_require__(2)
	__webpack_require__(9)
	__webpack_require__(12)
	__webpack_require__(14)
	__webpack_require__(15)
	__webpack_require__(16)
	__webpack_require__(18)

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

	      template: __webpack_require__(21),

	      controller: 'FormMController as formMHome'
	    })
	}

	app.controller('FormMController', FormMController)
	FormMController.$inject = ['$state', '$scope']
	function FormMController($state, $scope) {

	  var listFormMTab = {
	    title: 'List Form M',
	    viewName: 'listFormM',
	    select: function() {
	      $scope.updateAddFormMTitle()
	      $state.go('form_m.list')
	    }
	  }

	  var addFormMTitle = 'Form M'

	  var addFormMTab = {
	    title: addFormMTitle,
	    active: true,
	    viewName: 'addFormM',
	    select: function() { $state.go('form_m.add')}
	  }

	  var reportsTab = {
	    title: 'Reports',
	    active: false,
	    viewName: 'formMReports',
	    select: function() {
	      $scope.updateAddFormMTitle()
	      $state.go('form_m.add')
	    }
	  }

	  var bidsTab = {
	    title: 'Pending Bids',
	    active: false,
	    viewName: 'bids',
	    select: function() {
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

	  $scope.updateAddFormMTitle = function(formM) {
	    $scope.tabs.addFormM.title = formM ? 'Details of "' + formM.number + '"' : addFormMTitle
	  }

	  $scope.goToFormM = function goToFormM(formM) {
	    $state.go('form_m.add', {detailedFormM: formM})
	    $scope.tabs.addFormM.active = true
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	__webpack_require__(3)
	__webpack_require__(7)

	var app = angular.module('add-form-m', [
	  'ui.router',
	  'rootApp',
	  'kanmii-underscore',
	  'customer',
	  'search-detailed-or-uploaded-form-m',
	  'form-m-service',
	  'lc-cover',
	  'lc-issue',
	  'lc-bid-request',
	  'confirmation-dialog'
	])

	app.config(formMStateURLConfig)

	formMStateURLConfig.$inject = ['$stateProvider']

	function formMStateURLConfig($stateProvider) {
	  $stateProvider
	    .state('form_m.add', {
	      kanmiiTitle: 'Add form M',

	      params: {detailedFormM: null, showSummary: null},

	      views: {
	        addFormM: {
	          templateUrl: __webpack_require__(4).buildUrl('form-m/add-form-m/add-form-m.html'),

	          controller: 'AddFormMStateController as addFormMState'
	        }
	      }
	    })
	}

	app.controller('AddFormMStateController', AddFormMStateController)

	AddFormMStateController.$inject = [
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency',
	  'SearchDetailedOrUploadedFormMService',
	  'kanmiiUnderscore',
	  'formatDate',
	  'xhrErrorDisplay',
	  'formMAttributesVerboseNames',
	  'FormM',
	  '$timeout',
	  '$filter',
	  '$stateParams',
	  'resetForm2',
	  '$state',
	  '$scope',
	  'LcBidRequest',
	  'confirmationDialog'
	]

	function AddFormMStateController(getTypeAheadCustomer, getTypeAheadCurrency, SearchDetailedOrUploadedFormMService,
	  kanmiiUnderscore, formatDate, xhrErrorDisplay, formMAttributesVerboseNames, FormM, $timeout, $filter, $stateParams,
	  resetForm2, $state, $scope, LcBidRequest, confirmationDialog) {
	  var vm = this

	  vm.detailedFormM = angular.copy($stateParams.detailedFormM)
	  $stateParams.detailedFormM = null

	  /*
	   *@param {angular.form} the HTML fieldSet element for form M cover
	   */
	  var coverForm

	  /*
	   *@param {angular.form} the HTML fieldSet element for form M issues
	   */
	  var issuesForm

	  initialize()
	  function initialize(form) {
	    vm.existingBids = []

	    if (vm.detailedFormM) initDetailedFormM()
	    else {
	      $scope.updateAddFormMTitle()
	      vm.formM = {
	        date_received: new Date()
	      }

	      vm.fieldsEdit = {
	        number: false,
	        currency: false,
	        applicant: false,
	        date_received: false,
	        amount: false
	      }

	      vm.closedIssues = []
	      vm.nonClosedIssues = []
	    }

	    vm.showEditBid = false
	    vm.showBidForm = false
	    vm.searchFormM = {}
	    initFormMSavingIndicator()

	    if (form) {
	      form.$setPristine()
	      form.$setUntouched()
	    }

	    /*
	     *@param {angular.form.model} the form M cover model
	     */
	    vm.cover = null

	    /*
	     *@param {angular.form.model} bid model that we want to create for the form M
	     */
	    vm.bid = {}

	    /*
	     *@param {angular.form.model} the form M issues model
	     */
	    vm.issues = []

	    vm.nonClosedIssues = []
	  }

	  function initDetailedFormM() {
	    vm.formM = {
	      date_received: new Date(vm.detailedFormM.date_received),
	      number: vm.detailedFormM.number,
	      applicant: vm.detailedFormM.applicant_data,
	      currency: vm.detailedFormM.currency_data,
	      amount: Number(vm.detailedFormM.amount),
	      goods_description: vm.detailedFormM.goods_description,
	      form_m_issues: vm.detailedFormM.form_m_issues,
	      url: vm.detailedFormM.url,
	      covers: vm.detailedFormM.covers
	    }

	    $scope.updateAddFormMTitle(vm.formM)

	    LcBidRequest.getPaginated({mf: vm.formM.number}).$promise.then(function(data) {
	      if (data.count) {
	        var results = data.results

	        if (results.length) vm.existingBids = results
	      }
	    })

	    vm.fieldsEdit = {
	      number: true,
	      currency: true,
	      applicant: true,
	      date_received: true,
	      amount: true
	    }

	  }

	  function initFormMSavingIndicator() {
	    var summary = $stateParams.showSummary
	    $stateParams.showSummary = null

	    if (summary) {
	      confirmationDialog.showDialog({
	                                      title: '"' + vm.formM.number + '" successfully saved',
	                                      text: summary,
	                                      infoOnly: true
	                                    })
	    }
	  }

	  vm.onCoverChanged = function onCoverChanged(cover, form) {
	    vm.cover = cover
	    coverForm = form
	  }

	  vm.onIssuesChanged = function onIssuesChanged(issues, form) {
	    vm.issues = issues
	    issuesForm = form
	  }

	  vm.onNonClosedIssuesChanged = function onNonClosedIssuesChanged(issues) {
	    vm.nonClosedIssues = issues
	  }

	  vm.enableFieldEdit = function enableFieldEdit(field) {
	    vm.fieldsEdit[field] = vm.detailedFormM ? !vm.fieldsEdit[field] : false
	  }

	  vm.validators = {
	    applicant: {
	      test: function() {
	        return kanmiiUnderscore.isObject(vm.formM.applicant)
	      }
	    },

	    currency: {
	      test: function() {
	        return kanmiiUnderscore.isObject(vm.formM.currency)
	      }
	    }
	  }

	  vm.disableSubmitBtn = disableSubmitBtn
	  function disableSubmitBtn() {
	    if ($scope.newFormMForm.$invalid) return true

	    if (coverForm && coverForm.$invalid) return true

	    if ($scope.bidForm.$invalid) return true

	    if (issuesForm && issuesForm.$invalid) return true

	    if (vm.showEditBid) return true

	    var compared = compareDetailedFormMWithForm()

	    if (!compared) return false

	    if (kanmiiUnderscore.all(compared)) {
	      if (!kanmiiUnderscore.isEmpty(vm.bid) && vm.bid.goods_description && vm.bid.amount) return false
	      if (vm.cover && !kanmiiUnderscore.isEmpty(vm.cover)) return false
	      return !vm.issues.length
	    }

	    return false
	  }

	  vm.reset = reset
	  function reset(addFormMForm) {
	    vm.detailedFormM = null

	    resetForm2(addFormMForm, [
	      {
	        form: $scope.newFormMForm, elements: ['applicant', 'currency']
	      }
	    ])

	    initialize()
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

	    SearchDetailedOrUploadedFormMService.searchWithModal().then(function(data) {
	      if (data.detailed) {
	        vm.detailedFormM = data.detailed
	        initDetailedFormM()

	      } else {
	        var formM = data.uploaded
	        vm.searchFormM = formM
	        vm.formM.number = formM.mf
	        vm.formM.amount = formM.cost_freight
	        vm.formM.goods_description = formM.goods_description

	        getTypeAheadCurrency(formM.ccy).then(function(ccy) {
	          vm.formM.currency = ccy[0]
	        })
	      }
	    })
	  }

	  vm.submit = function submit(formM) {
	    var formMToSave = angular.copy(formM)

	    formMToSave.applicant = formMToSave.applicant.url
	    formMToSave.currency = formMToSave.currency.url
	    formMToSave.date_received = formatDate(formMToSave.date_received)

	    if (!kanmiiUnderscore.isEmpty(vm.bid)) {
	      formMToSave.goods_description = vm.bid.goods_description
	      formMToSave.bid = {amount: vm.bid.amount}
	    }

	    if (vm.issues.length) formMToSave.issues = vm.issues

	    if (vm.cover && !kanmiiUnderscore.isEmpty(vm.cover)) {
	      formMToSave.cover = {
	        amount: vm.cover.amount,
	        cover_type: vm.cover.cover_type[0]
	      }
	    }

	    if (!vm.detailedFormM) new FormM(formMToSave).$save(formMSavedSuccess, formMSavedError)

	    else {
	      if (kanmiiUnderscore.all(compareDetailedFormMWithForm1(formMToSave))) {
	        formMToSave.do_not_update = 'do_not_update'
	        formMToSave.applicant_data = vm.formM.applicant
	        formMToSave.currency_data = vm.formM.currency
	      }
	      formMToSave.id = vm.detailedFormM.id
	      new FormM(formMToSave).$put(formMSavedSuccess, formMSavedError)
	    }

	    function formMSavedSuccess(data) {
	      //even though non-closed issues will be set in the lc-issue directive, we need to read them off data received
	      //from server so we can display them as part of summary to users. :TODO find a better implementation
	      vm.nonClosedIssues = data.form_m_issues.filter(function(issue) {
	        return !issue.closed_at
	      })

	      var summary = showFormMMessage() + showIssuesMessage()

	      if (data.bid) {
	        summary += '\n\nBid Amount     : ' + data.currency_data.code + ' ' + $filter('number')(data.bid.amount, 2)
	      }

	      if (data.cover) data.covers.push(data.cover)

	      $state.go('form_m.add', {detailedFormM: data, showSummary: summary})
	    }

	    function formMSavedError(xhr) {
	      xhrErrorDisplay(xhr, formMAttributesVerboseNames)
	    }
	  }

	  vm.downloadSummary = function downloadSummary() {
	    confirmationDialog.showDialog({
	      title: vm.formM.number,
	      text: $scope.showFormMMessage() + $scope.showIssuesMessage(),
	      infoOnly: true
	    })
	  }

	  $scope.showFormMMessage = showFormMMessage
	  function showFormMMessage() {
	    var number = $filter('number')(vm.formM.amount, 2)
	    var header = vm.formM.applicant.name + ' - ' + vm.formM.number + ' - ' + vm.formM.currency.code + ' ' + number
	    return header + '\n\nForm M Number : ' + vm.formM.number + '\n' +
	           'Value         : ' + vm.formM.currency.code + ' ' +
	           number + '\n' +
	           'Applicant     : ' + vm.formM.applicant.name
	  }

	  $scope.showIssuesMessage = showIssuesMessage
	  function showIssuesMessage() {
	    if (!vm.nonClosedIssues.length) return ''

	    var issuesText = '\n\n\nPlease note the following issues which must be regularized before the LC ' +
	                     'request can be treated:\n'

	    kanmiiUnderscore.each(vm.nonClosedIssues, function(issue, index) {
	      ++index
	      issuesText += ('(' + index + ') ' + vm.formatIssueText(issue.text || issue.issue.text) + '\n')
	    })

	    return issuesText
	  }

	  vm.formatIssueText = function(text) {
	    return text.replace(/:ISSUE$/i, '')
	  }

	  function compareDetailedFormMWithForm() {
	    if (!vm.detailedFormM) return false

	    return {
	      number: vm.formM.number && angular.equals(vm.formM.number, vm.detailedFormM.number),

	      date_received: angular.equals(vm.formM.date_received, new Date(vm.detailedFormM.date_received)),

	      amount: vm.formM.amount && angular.equals(vm.formM.amount, Number(vm.detailedFormM.amount)),

	      currency: vm.formM.currency && (vm.formM.currency.code === vm.detailedFormM.currency_data.code),

	      applicant: vm.formM.applicant && (vm.formM.applicant.name === vm.detailedFormM.applicant_data.name)
	    }
	  }

	  function compareDetailedFormMWithForm1(formM) {
	    if (!vm.detailedFormM) return false

	    return {
	      number: formM.number && angular.equals(formM.number, vm.detailedFormM.number),

	      date_received: angular.equals(formM.date_received, new Date(vm.detailedFormM.date_received)),

	      amount: formM.amount && angular.equals(formM.amount, Number(vm.detailedFormM.amount)),

	      currency: formM.currency && (formM.currency.code === vm.detailedFormM.currency_data.code),

	      applicant: formM.applicant && (formM.applicant.name === vm.detailedFormM.applicant_data.name)
	    }
	  }
	}

	__webpack_require__(8)


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module('lc-issue', [
	  'rootApp',
	  'lc-issue-service'
	])

	app.directive('lcIssue', lcIssueDirective)

	lcIssueDirective.$inject = []

	function lcIssueDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__(4).buildUrl('form-m/add-form-m/lc-issue/lc-issue.html'),
	    scope: true,
	    bindToController: {
	      formM: '=mfContext',
	      issues: '=',
	      onIssuesChanged: '&',
	      onNonClosedIssuesChanged: '&'
	    },
	    controller: 'LcIssueDirectiveController as lcIssue'
	  }
	}

	app.controller('LcIssueDirectiveController', LcIssueDirectiveController)

	LcIssueDirectiveController.$inject = [
	  '$scope',
	  'LCIssueConcrete',
	  'getTypeAheadLCIssue',
	  'formatDate',
	  'xhrErrorDisplay',
	  'resetForm2',
	  'clearFormField',
	  'confirmationDialog'
	]

	function LcIssueDirectiveController($scope, LCIssueConcrete, getTypeAheadLCIssue, formatDate, xhrErrorDisplay,
	  resetForm2, clearFormField, confirmationDialog) {
	  var vm = this
	  var title = 'Add Letter Of Credit Issues'

	  initExistingIssues()
	  function initExistingIssues() {
	    vm.closedIssues = []
	    vm.nonClosedIssues = []
	  }

	  initContainerVars()
	  function initContainerVars(form) {
	    vm.title = title
	    vm.showContainer = false

	    vm.issues = []
	    vm.issue = null

	    if (form) resetForm2(form, [
	      {form: form, elements: ['issue']}
	    ])
	  }

	  vm.closeIssue = function closeIssue(issue, $index) {
	    var closedAt = formatDate(new Date())

	    var text = 'Sure you want to close issue:\n"' +
	               $scope.addFormMState.formatIssueText(issue.issue.text) + '"?'

	    confirmationDialog.showDialog({title: 'Close issue', text: text}).then(function(answer) {
	      if (answer) {
	        LCIssueConcrete.put({
	          id: issue.id,
	          mf: vm.formM.url,
	          issue: issue.issue.url,
	          closed_at: closedAt
	        }).$promise.then(issueClosedSuccess, issueClosedError)
	      }
	    })

	    function issueClosedSuccess() {
	      var text = 'Issue closed successfully:\n' + $scope.addFormMState.formatIssueText(issue.issue.text)
	      confirmationDialog.showDialog({title: 'Close issue', text: text, infoOnly: true})
	      vm.nonClosedIssues.splice($index, 1)
	      issue.closed_at = closedAt
	      vm.closedIssues.push(issue)
	    }

	    function issueClosedError(xhr) {xhrErrorDisplay(xhr)}
	  }

	  vm.issueSelected = function issueSelected($item, $model) {
	    vm.issues.push($model)
	    vm.issue = null
	    clearFormField($scope.issuesForm, 'issue')
	  }

	  vm.deleteIssue = function deleteIssue(index) {
	    vm.issues.splice(index, 1)
	  }

	  vm.getIssue = function getIssue(text) {
	    var _ids = []

	    vm.issues.forEach(function(issue) {
	      _ids.push(issue.id)
	    })

	    var x = []

	    x.concat(vm.nonClosedIssues).concat(vm.closedIssues).forEach(function(issue) {
	      _ids.push(issue.issue.id)
	    })

	    return getTypeAheadLCIssue({text: text, exclude_issue_ids: _ids.join(',')})
	  }

	  vm.toggleShow = function toggleShow(form) {
	    vm.showContainer = vm.formM.amount && vm.formM.number && !vm.showContainer

	    if (!vm.showContainer) initContainerVars(form)
	    else vm.title = 'Dismiss'
	  }

	  $scope.$watch(function getFormM() {return vm.formM}, function(newFormM) {
	    if (newFormM) {
	      var formMIssues = newFormM.form_m_issues
	      if (formMIssues && formMIssues.length !== (vm.closedIssues.length + vm.nonClosedIssues.length)) {
	        formMIssues.forEach(function(issue) {
	          if (!issue.closed_at) {
	            vm.nonClosedIssues.push(issue)
	            return true
	          }
	          else {
	            vm.closedIssues.push(issue)
	            return false
	          }
	        })
	      }

	      if (!newFormM.number || !newFormM.amount) {
	        initExistingIssues()
	        initContainerVars()
	      }
	    }
	  }, true)

	  $scope.$watch(function getIssues() {return vm.issues}, function onUpdateIssues(newIssues) {
	    $scope.issuesForm.issue.$validate()
	    if (newIssues) vm.onIssuesChanged({issues: newIssues, issuesForm: $scope.issuesForm})
	  }, true)

	  $scope.$watch(function getNonClosedIssues() {return vm.nonClosedIssues}, function onUpdateNonClosedIssues(newIssues) {
	    if (newIssues) vm.onNonClosedIssuesChanged({issues: newIssues})
	  }, true)

	  $scope.$watch(function getShowContainer() {return vm.showContainer}, function onUpdateShowContainer() {
	    $scope.issuesForm.issue.$validate()
	  })
	}

	app.directive('validateIssues', function validateIssues() {
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function($scope, elm, atts, ctrl) {
	      var vm = $scope.lcIssue
	      ctrl.$validators.issues = function() {
	        return !vm.showContainer || Boolean(vm.issues.length)
	      }
	    }
	  }
	})


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var lcCommons = __webpack_require__(5)

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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var rootCommons = __webpack_require__(6)

	var appName = 'letter_of_credit'

	function buildUrl(fsPath) {
	  return rootCommons.buildUrl(appName, fsPath)
	}

	module.exports = {
	  buildUrl: buildUrl,
	  appName: appName
	}


/***/ },
/* 6 */
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var app = angular.module('lc-cover', [
	  'rootApp'
	])

	app.directive('lcCover', lcIssueDirective)

	lcIssueDirective.$inject = []

	function lcIssueDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__(4).buildUrl('form-m/add-form-m/lc-cover/lc-cover.html'),
	    scope: true,
	    bindToController: {
	      formM: '=mfContext',
	      cover: '=',
	      onCoverChanged: '&'
	    },
	    controller: 'LcCoverDirectiveController as lcCover'
	  }
	}

	app.controller('LcCoverDirectiveController', LcCoverDirectiveController)

	LcCoverDirectiveController.$inject = [
	  '$scope',
	  'formMCoverTypes',
	  '$filter',
	  'formFieldIsValid'
	]

	function LcCoverDirectiveController($scope, formMCoverTypes, $filter, formFieldIsValid) {
	  var vm = this
	  var title = 'Register Cover'
	  init()

	  function init(form) {
	    vm.title = title
	    vm.showContainer = false
	    vm.cover = {}
	    vm.coverTypes = null

	    if (form) {
	      form.$setPristine()
	      form.$setUntouched()
	    }
	  }

	  vm.isValid = function isValid(name, validity) {
	    return formFieldIsValid($scope, 'coverForm', name, validity)
	  }

	  vm.amountGetterSetter = function(val) {
	    if (arguments.length) {
	      if (!/[\d,\.]+/.test(val)) vm.cover.amount = null
	      else vm.cover.amount = Number(val.replace(/,/g, ''))
	    } else return vm.cover.amount ? $filter('number')(vm.cover.amount, 2) : undefined
	  }

	  vm.toggleShow = function toggleShow(form) {
	    vm.showContainer = vm.formM.amount && vm.formM.number && !vm.showContainer

	    if (!vm.showContainer) {
	      init(form)
	    }
	    else {
	      vm.title = 'Dismiss'
	      vm.coverTypes = formMCoverTypes
	      vm.cover.amount = vm.formM.amount
	    }
	  }

	  $scope.$watch(function getFormM() {return vm.formM}, function(newFormM) {
	    if (newFormM) {
	      if (! newFormM.number || !newFormM.amount) init()
	    }
	  }, true)

	  $scope.$watch(function getCover() {return vm.cover}, function(newCover) {
	    vm.onCoverChanged({
	      cover: newCover, coverForm: $scope.coverForm
	    })

	  }, true)
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var app = angular.module('add-form-m')

	app.directive('lcBid', lcBidDirective)

	lcBidDirective.$inject = []

	function lcBidDirective() {
	  return {
	    restrict: 'A',
	    templateUrl: __webpack_require__(4).buildUrl('form-m/add-form-m/lc-bid/lc-bid.html'),
	    scope: false,
	    bindToController: {
	      bid: '='
	    },
	    controller: 'LcBidDirectiveController as lcBid'
	  }
	}

	app.controller('LcBidDirectiveController', LcBidDirectiveController)

	LcBidDirectiveController.$inject = [
	  '$scope',
	  '$filter',
	  'formFieldIsValid',
	  'kanmiiUnderscore',
	  'LcBidRequest',
	  'xhrErrorDisplay',
	  'confirmationDialog'
	]

	function LcBidDirectiveController($scope, $filter, formFieldIsValid, kanmiiUnderscore, LcBidRequest, xhrErrorDisplay,
	  confirmationDialog) {
	  var vm = this
	  var title = 'Make Bid Request'
	  init()

	  function init(form) {
	    vm.title = title
	    $scope.addFormMState.showBidForm = false
	    $scope.addFormMState.bid = {}

	    $scope.addFormMState.showEditBid = false
	    vm.bidToEdit = null

	    if (form) {
	      form.$setPristine()
	      form.$setUntouched()
	    }
	  }

	  vm.isValid = function(name, validity) {
	    return formFieldIsValid($scope, 'bidForm', name, validity)
	  }

	  vm.amountGetterSetter = function(val) {
	    if (arguments.length) {
	      if (!/[\d,\.]+/.test(val)) $scope.addFormMState.bid.amount = null
	      else $scope.addFormMState.bid.amount = Number(val.replace(/,/g, ''))

	    } else return $scope.addFormMState.bid.amount ? $filter('number')($scope.addFormMState.bid.amount, 2) : undefined
	  }

	  vm.toggleShow = function toggleShow(form) {
	    $scope.addFormMState.showBidForm = $scope.addFormMState.formM.amount && $scope.addFormMState.formM.number && !$scope.addFormMState.showBidForm

	    if (!$scope.addFormMState.showBidForm) {
	      init(form)
	    }
	    else {
	      vm.title = 'Dismiss'
	      var goods = $scope.addFormMState.formM.goods_description
	      if (goods) $scope.addFormMState.bid.goods_description = goods

	      $scope.addFormMState.bid.amount = !$scope.addFormMState.existingBids.length ?
	                                        $scope.addFormMState.formM.amount : null
	    }
	  }

	  vm.editBidInvalid = function editBidInvalid() {
	    if (kanmiiUnderscore.isEmpty(vm.bidToEdit)) return true

	    if ($scope.bidForm.$invalid) return true

	    return kanmiiUnderscore.all(bidNotModified())
	  }

	  vm.onBidDblClick = function onBidDblClick(bid, $index) {
	    $scope.addFormMState.showEditBid = true
	    $scope.addFormMState.showBidForm = false
	    vm.toggleShow()
	    vm.bidToEdit = angular.copy(bid)
	    vm.bidToEdit.amount = Number(vm.bidToEdit.amount)
	    vm.bidToEdit.$index = $index
	    $scope.addFormMState.bid.amount = vm.bidToEdit.amount
	  }

	  vm.trashBid = function trashBid(bid, $index) {
	    var text = '\n\nApplicant: ' + bid.applicant +
	               '\nForm M: ' + bid.form_m_number +
	               '\nBid Amount: ' + bid.currency + ' ' + $filter('number')(bid.amount, 2)

	    var mf = '"' + bid.form_m_number + '"'

	    confirmationDialog.showDialog({
	                                    text: 'Sure you want to delete bid:' + text, title: 'Delete bid for ' + mf
	                                  }).then(function(answer) {
	      if (answer) {
	        LcBidRequest.delete(bid).$promise.then(bidDeleteSuccess, function bidDeleteFailure(xhr) {
	          xhrErrorDisplay(xhr)
	        })
	      }
	    })

	    function bidDeleteSuccess() {
	      confirmationDialog.showDialog({
	                                      text: 'Bid delete successfully:' + text,
	                                      title: 'Bid for ' + mf + ' deleted successfully',
	                                      infoOnly: true
	                                    })

	      $scope.addFormMState.existingBids.splice($index, 1)
	    }
	  }

	  vm.editBid = function editBid() {
	    var title = 'Edit bid "' + vm.bidToEdit.form_m_number + '"'

	    var ccy = $scope.addFormMState.formM.currency.code
	    var text = '\n\nForm M:           ' + vm.bidToEdit.form_m_number +
	               '\nBid Amount' +
	               '\n  before edit:    ' + ccy + $filter('number')(vm.bidToEdit.amount, 2) +
	               '\n  after edit:     ' + ccy + $filter('number')($scope.addFormMState.bid.amount, 2) +
	               '\nGoods description' +
	               '\n  before edit:    ' + vm.bidToEdit.goods_description +
	               '\n\n  after edit:     ' + $scope.addFormMState.bid.goods_description

	    confirmationDialog.showDialog({
	                                    title: title,
	                                    text: 'Are you sure you want to edit Bid:' + text
	                                  }).then(function(answer) {
	      if (answer) doEdit()
	    })

	    function doEdit() {
	      var bid = angular.copy(vm.bidToEdit)
	      bid.amount = $scope.addFormMState.bid.amount
	      bid.goods_description = $scope.addFormMState.bid.goods_description

	      //we need to do this so this bid can show up at the bid list interface in case user wishes to download and
	      //send the bid to treasury
	      bid.requested_at = null

	      LcBidRequest.put(bid).$promise.then(function() {
	        confirmationDialog.showDialog({title: title, text: 'Edit successful: ' + text, infoOnly: true})
	        $scope.addFormMState.existingBids.splice(bid.$index, 1, bid)
	        init()
	      }, function(xhr) {
	        xhrErrorDisplay(xhr)
	      })
	    }
	  }

	  function bidNotModified() {
	    return {
	      amount: vm.bidToEdit.amount === $scope.addFormMState.bid.amount,
	      goods_description: vm.bidToEdit.goods_description === $scope.addFormMState.bid.goods_description
	    }
	  }
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var rootCommons = __webpack_require__(6)

	var app = angular.module('form-m-bids', [
	  'ui.router',
	  'lc-bid-request',
	  'rootApp',
	  'kanmii-URI',
	  'kanmii-underscore',
	  'form-m-service'
	])

	app.config(rootCommons.interpolateProviderConfig)

	app.config(bidURLConfig)
	bidURLConfig.$inject = ['$stateProvider']
	function bidURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m.bids', {

	      kanmiiTitle: 'Bids',

	      views: {
	        bids: {
	          template: __webpack_require__(10),

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
	  'kanmiiUnderscore',
	  'formatDate',
	  '$timeout',
	  '$q',
	  'FormM'
	]
	function BidRequestController(LcBidRequest, $scope, $http, kanmiiUri, urls, kanmiiUnderscore, formatDate, $timeout, $q,
	  FormM) {
	  var vm = this;

	  initialize()
	  function initialize() {
	    vm.newBid = null

	    /**
	     * When the search-bid directive returns, the result is propagated into this model
	     * @type {null|object}
	     */
	    vm.searchedBidResult = null

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
	    LcBidRequest.pending().$promise.then(function(data) {
	      updateBids(data)
	    })
	  }

	  /**
	   * When a row of the pending bids table is clicked, this function is invoked with the bid at that row
	   * @param {{}} bid - the bid object at the row that was double clicked
	   */
	  vm.rowDblClickCb = function rowDblClickCb(bid) {
	    FormM.getPaginated({number: bid.form_m_number}).$promise.then(function(data) {
	      var results = data.results
	      if (results.length && results.length === 1) {
	        $scope.goToFormM(results[0])
	      }
	    })
	  }

	  /**
	   * The table caption for the 'model-table' directive
	   * @type {string}
	   */
	  vm.tableCaption = 'Pending Bids'

	  /**
	   * Will be invoked when any of the pager links is clicked in other to get the bids at the pager url
	   * @type {getBidsOnNavigation}
	   */
	  vm.getBidsOnNavigation = getBidsOnNavigation
	  function getBidsOnNavigation(linkUrl) {
	    $http.get(linkUrl).then(function(response) {
	      updateBids(response.data)
	    })
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
	    if (!kanmiiUnderscore.isEmpty(vm.selectedBids)) {
	      var search = []

	      kanmiiUnderscore.each(vm.selectedBids, function(selection, bidId) {
	        if (selection === true) search.push(bidId)
	      })

	      return url.search({bid_ids: search}).toString()
	    }
	  }

	  vm.downloadBtnDisabled = function downloadBtnDisabled() {
	    if (kanmiiUnderscore.isEmpty(vm.selectedBids)) return true

	    return !kanmiiUnderscore.any(vm.selectedBids, function(selectionVal) {
	      return selectionVal === true
	    })
	  }

	  vm.onSelectedBidsChanged = onSelectedBidsChanged
	  function onSelectedBidsChanged(newSelections) {
	    if (newSelections && !kanmiiUnderscore.isEmpty(newSelections)) {
	      kanmiiUnderscore.each(newSelections, function(checked, bidId) {
	        var bid = getBidFromId(bidId)

	        if (bid && bid.downloaded) vm.selectedDownloadedBids[bidId] = checked
	      })
	    }
	  }

	  vm.markRequestedBtnDisabled = function markRequestedBtnDisabled() {
	    if (kanmiiUnderscore.isEmpty(vm.selectedDownloadedBids)) return true

	    //return true if un-downloaded bid is checked
	    //return false if there is at least one downloaded bid checked
	    var anyNoneDownloadedChecked = kanmiiUnderscore.any(vm.selectedBids, function(checked, bidId) {
	      return !kanmiiUnderscore.has(vm.selectedDownloadedBids, bidId) && checked === true
	    })

	    if (anyNoneDownloadedChecked) return true
	    else return !kanmiiUnderscore.any(vm.selectedDownloadedBids, function(checked) {
	      return checked === true
	    })
	  }

	  vm.markRequested = function markRequested() {
	    var editedBids = []

	    kanmiiUnderscore.each(vm.selectedDownloadedBids, function(checked, bidId) {
	      if (!checked) return

	      var bid = getBidFromId(bidId)
	      if (bid) {
	        bid.requested_at = formatDate(new Date())
	        //LcBidRequest.put(bid).$promise.then(bidEditSuccess, bidEditFailure)
	        editedBids.push(LcBidRequest.put(bid).$promise)
	      }
	    })

	    if (editedBids.length) {
	      $q.all(editedBids).then(function() {
	        initialize()
	      })
	    }
	  }

	  vm.refreshPage = function refreshPage() {
	    $timeout(function() {initialize()}, 3000)
	  }

	  function getBidFromId(bidId) {
	    for (var index = 0; index < vm.bidRequests.length; index++) {
	      var bid = vm.bidRequests[index]
	      if (bid.id === +bidId) return bid
	    }

	    return null
	  }
	}

	__webpack_require__(11)


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-m-home-view\"><div class=\"action-buttons\" style=\"text-align: right;margin-bottom: 30px;\"><button class=\"btn btn-info\" ng-click=\"bidHome.searchBids()\">Search Bid Requests</button> <a class=\"btn btn-success\" ng-href=\"{$bidHome.downloadUrl()$}\" ng-disabled=\"bidHome.downloadBtnDisabled()\" ng-click=\"bidHome.refreshPage()\">Download</a> <button type=\"button\" name=\"bid-home-mark-as-requested-btn\" class=\"btn btn-success\" ng-click=\"bidHome.markRequested()\" ng-disabled=\"bidHome.markRequestedBtnDisabled()\">Mark as requested</button></div><div display-pending-bid=\"\" pending-bids=\"bidHome.bidRequests\" pager-object=\"bidHome.paginationHooks\" update-collection=\"bidHome.getBidsOnNavigation(linkUrl)\" pagination-size=\"20\" selected-bids=\"bidHome.selectedBids\" on-selected-bids-changed=\"bidHome.onSelectedBidsChanged(newSelections)\" on-row-dbl-click=\"bidHome.rowDblClickCb(bid)\"></div></div>";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var lcAppCommons = __webpack_require__(4)

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
	  'kanmiiUnderscore'
	]

	function displayPendingBidDirectiveCtrl(pagerNavSetUpLinks, scope, kanmiiUnderscore) {
	  var vm = this //jshint -W040

	  vm.selectedBids = {}

	  function setUpLinks(next, prev, count) {

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
	    if (pager && !kanmiiUnderscore.isEmpty(pager)) {
	      setUpLinks(pager.next, pager.previous, pager.count)
	    }
	  })

	  function deselectAllBids() {
	    vm.bids.forEach(function(bid) {
	      bid.highlighted = false
	    })
	  }

	  vm.modelRowClicked = modelRowClicked
	  function modelRowClicked(model) {
	    if (!model.downloaded) {
	      deselectAllBids()

	      //only highlight a row if no row is checked and the row model is not downloaded previously
	      model.highlighted = !kanmiiUnderscore.any(vm.bids, function(bid) {
	        return bid.checked
	      })
	    }
	  }

	  vm.onRowDblClick = function onRowDblClick(bid) {
	    vm.onDblClick({bid: bid})
	  }

	  scope.$watch(function getSelectedBids() {return vm.selectedBids}, function updatedSelectedBids(selectedBids) {
	    vm.onSelectedBidsChanged({newSelections: selectedBids})

	    if (selectedBids && !kanmiiUnderscore.isEmpty(selectedBids)) {

	      kanmiiUnderscore.each(selectedBids, function(checked, id) {

	        for (var bidIndex = 0; bidIndex < vm.bids.length; bidIndex++) {
	          var bid = vm.bids[bidIndex]
	          if (bid.id === +id) {
	            bid.checked = checked
	          }
	        }

	      })

	      vm.toggleAll = kanmiiUnderscore.all(vm.bids, function(bid) {
	        return bid.checked === true
	      })
	    }
	  }, true)

	  vm.toggleAll = false

	  vm.toggleAllClicked = function toggleAllClicked() {
	    vm.bids.forEach(function(bid) {
	      vm.selectedBids[bid.id] = vm.toggleAll
	    })
	  }
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	var rootCommons = __webpack_require__(6)

	var app = angular.module('list-form-m',
	  ['rootApp',
	   'ui.router',
	   'form-m-service',
	   'form-m-search',
	   'model-table',
	   'customer',
	   'add-form-m'
	  ])

	app.config(rootCommons.interpolateProviderConfig)

	app.config(formMListURLConfig)
	formMListURLConfig.$inject = ['$stateProvider']
	function formMListURLConfig($stateProvider) {

	  $stateProvider
	    .state('form_m.list', {
	      kanmiiTitle: 'Form M List',

	      views: {
	        'listFormM': {
	          template: __webpack_require__(13),

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
	    scope.goToFormM(formM)
	  }

	  /**
	   * Update the form Ms collection and pagination hooks
	   * @param {object} data
	   */
	  function updateFormMs(data) {
	    vm.formMs = data.results

	    vm.paginationHooks = {next: data.next, previous: data.previous, count: data.count}
	  }

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
	  FormM.getNoLcAttached().$promise.then(function(data) {
	    updateFormMs(data)
	  })

	  /**
	   * The table caption for the 'model-table' directive
	   * @type {string}
	   */
	  vm.tableCaption = 'Form M (LC Not Established)'

	  vm.getFormMCollectionOnNavigation = getFormMCollectionOnNavigation
	  /**
	   * when we navigate through the form Ms, we make an http request to the link contained in the navigation ui
	   * @param {string} linkUrl - the url (href) of the link clicked by user
	   */
	  function getFormMCollectionOnNavigation(linkUrl) {
	    $http.get(linkUrl).then(function(response) {
	      updateFormMs(response.data)
	    })
	  }

	  /**
	   * When the search-form-m directive returns, the result is propagated into this model
	   * @type {null|object}
	   */
	  vm.searchedFormMResult = null

	  scope.$watch(function getNewFormM() {return vm.searchedFormMResult}, function(searchedFormMResult) {
	    if (searchedFormMResult) updateFormMs(searchedFormMResult)
	  })
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "<div class=\"manage-form-m-tab-content\"><div class=\"action-buttons pull-right\"><button class=\"btn btn-info\" search-form-m=\"\" search-form-m-result=\"formMList.searchedFormMResult\">Search Form M</button></div><div model-table=\"\" model-collection=\"formMList.formMs\" table-model-manager=\"::formMList.modelManager\" table-caption=\"::formMList.tableCaption\" pagination-size=\"20\" update-collection=\"formMList.getFormMCollectionOnNavigation(linkUrl)\" pager-object=\"formMList.paginationHooks\" on-row-dbl-click-callback=\"formMList.modelRowDblClick(rowModel)\"></div></div>";

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('search-detailed-or-uploaded-form-m', [
	  'kanmii-underscore',
	  'upload-form-m-service',
	  'toggle-dim-element',
	  'form-m-service'
	])

	app.factory('SearchDetailedOrUploadedFormMService', SearchDetailedOrUploadedFormMService)
	SearchDetailedOrUploadedFormMService.$inject = [
	  'UploadFormM',
	  'xhrErrorDisplay',
	  'ModalService',
	  'kanmiiUnderscore',
	  '$q',
	  'FormM'
	]
	function SearchDetailedOrUploadedFormMService(UploadFormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q, FormM) {

	  function searchFormM(submittedSearchParams) {
	    var deferred = $q.defer()
	    var mf = submittedSearchParams.mf

	    FormM.getPaginated({number: mf}).$promise.then(function(data) {
	      if (data.count === 1) {
	        deferred.resolve({detailed: data.results[0]})

	      } else UploadFormM.query({mf: mf}).$promise.then(searchFormMSuccess, searchFormMError)

	    }, searchFormMError)

	    function searchFormMSuccess(data) {
	      if (data.length === 1) deferred.resolve({uploaded: data[0]})
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
	        templateUrl: __webpack_require__(4).buildUrl(
	          'form-m/search-detailed-or-uploaded-form-m/search-detailed-or-uploaded-form-m-modal.html'),

	        controller: 'SearchDetailedOrUploadedFormMServiceModalCtrl as searchUploadedFormMModal'
	      }).then(function(modal) {
	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 500,
	          minHeight: 200,
	          title: 'Search Form M',

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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('form-m-search-service', ['kanmii-underscore', 'toggle-dim-element'])

	app.factory('SearchFormMService', SearchFormMService)
	SearchFormMService.$inject = [
	  'FormM',
	  'xhrErrorDisplay',
	  'ModalService',
	  'kanmiiUnderscore',
	  '$q',
	  'ToggleDimElement'
	]
	function SearchFormMService(FormM, xhrErrorDisplay, ModalService, kanmiiUnderscore, $q, ToggleDimElement) {

	  function searchFormM(submittedSearchParams) {
	    var deferred = $q.defer()
	    var searchParams = angular.copy(submittedSearchParams)

	    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
	    if (searchParams.currency) searchParams.currency = searchParams.currency.code

	    FormM.getPaginated(searchParams).$promise.then(searchFormMSuccess, searchFormMError)

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
	    function searchWithModal(config) {
	      var deferred = $q.defer()
	      config = config || {}

	      ModalService.showModal({
	        templateUrl: __webpack_require__(4).buildUrl('form-m/search-form-m-service/search-form-m-modal.html'),
	        controller: 'SearchFormMServiceModalCtrl as searchFormMModal',
	        inputs: {
	          uiOptions: config.uiOptions
	        }

	      }).then(function(modal) {
	        modal.element.dialog({
	          dialogClass: 'no-close',
	          modal: true,
	          minWidth: 600,
	          minHeight: 450,
	          title: 'Search Form M',

	          open: function() {
	            config.dim && ToggleDimElement.dim(config.parent, config.dimCb) //jshint -W030
	          },

	          close: function() {
	            config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb) //jshint -W030
	          }
	        })

	        modal.close.then(function(submittedSearchParams) {
	          if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
	            deferred.resolve(searchFormM(submittedSearchParams))
	          }

	          config.dim && ToggleDimElement.unDim(config.parent, config.unDimCb) //jshint -W030
	        })
	      })

	      return deferred.promise
	    }
	  }

	  return new SearchService()
	}

	app.controller('SearchFormMServiceModalCtrl', SearchFormMServiceModalCtrl)
	SearchFormMServiceModalCtrl.$inject = [
	  'uiOptions',
	  'close',
	  'resetForm',
	  '$element',
	  'getTypeAheadCustomer',
	  'getTypeAheadCurrency'
	]
	function SearchFormMServiceModalCtrl(uiOptions, close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
	  var vm = this

	  vm.displayLcIssueUI = false

	  if (uiOptions) {
	    vm.displayLcIssueUI = uiOptions.displayLcIssueUI
	  }

	  initForm()
	  function initForm() {
	    vm.searchParams = {}
	    vm.showLcIssueContainer = false
	    vm.searchLcIssuesTitle = 'Search By Letter Of Credit Issues'
	    vm.selectedLcIssues = {}
	  }

	  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
	  function toggleShowLcIssueContainer() {
	    vm.showLcIssueContainer = !vm.showLcIssueContainer

	    vm.searchLcIssuesTitle = !vm.showLcIssueContainer ? 'Search By Letter Of Credit Issues' : 'Dismiss'
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint camelcase:false*/

	var app = angular.module('form-m-search', ['kanmii-underscore'])

	app.directive('searchFormM', searchFormMDirective)
	searchFormMDirective.$inject = ['ModalService', 'kanmiiUnderscore']
	function searchFormMDirective(ModalService, kanmiiUnderscore) {
	  return {
	    restrict: 'A',

	    link: function(scope, elm, attributes, self) {
	      elm
	        .css({cursor: 'pointer'})
	        .bind('click', function() {
	                ModalService.showModal({
	                  template: __webpack_require__(17),

	                  controller: 'SearchFormMModalCtrl as searchFormMModal'

	                }).then(function(modal) {
	                  modal.element.dialog({
	                    dialogClass: 'no-close',
	                    modal: true,
	                    minWidth: 600,
	                    minHeight: 450,
	                    title: 'Search Form M'
	                  })

	                  modal.close.then(function(submittedSearchParams) {
	                    if (submittedSearchParams && angular.isObject(submittedSearchParams) && !kanmiiUnderscore.isEmpty(submittedSearchParams)) {
	                      self.searchFormM(submittedSearchParams)
	                    }
	                  })
	                })
	              })
	    },

	    controller: 'SearchFormMDirectiveCtrl as searchFormM',

	    scope: {},

	    bindToController: {
	      searchFormMResult: '='
	    }
	  }
	}

	app.controller('SearchFormMDirectiveCtrl', SearchFormMDirectiveCtrl)
	SearchFormMDirectiveCtrl.$inject = ['FormM', 'xhrErrorDisplay']
	function SearchFormMDirectiveCtrl(FormM, xhrErrorDisplay) {
	  var vm = this

	  vm.searchFormM = searchFormM
	  function searchFormM(submittedSearchParams) {
	    var searchParams = angular.copy(submittedSearchParams)

	    if (searchParams.applicant) searchParams.applicant = searchParams.applicant.name
	    if (searchParams.currency) searchParams.currency = searchParams.currency.code

	    FormM.getPaginated(searchParams).$promise.then(searchFormMSuccess, searchFormMError)

	    function searchFormMSuccess(data) {
	      vm.searchFormMResult = data
	    }

	    function searchFormMError(xhr) {
	      xhrErrorDisplay(xhr)
	    }
	  }
	}

	app.controller('SearchFormMModalCtrl', SearchFormMModalCtrl)
	SearchFormMModalCtrl.$inject = ['close', 'resetForm', '$element', 'getTypeAheadCustomer', 'getTypeAheadCurrency']
	function SearchFormMModalCtrl(close, resetForm, element, getTypeAheadCustomer, getTypeAheadCurrency) {
	  var vm = this

	  initForm()
	  function initForm() {
	    vm.searchParams = {}
	    vm.showLcIssueContainer = false
	    vm.searchLcIssuesTitle = 'Search By Letter Of Credit Issues'
	    vm.selectedLcIssues = {}
	  }

	  vm.toggleShowLcIssueContainer = toggleShowLcIssueContainer
	  function toggleShowLcIssueContainer() {
	    vm.showLcIssueContainer = !vm.showLcIssueContainer

	    vm.searchLcIssuesTitle = !vm.showLcIssueContainer ? 'Search By Letter Of Credit Issues' : 'Dismiss'
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
/* 17 */
/***/ function(module, exports) {

	module.exports = "<div id=\"search-form-m-root-container\" class=\"search-form-m-root-container\"><form novalidate=\"\" class=\"form-horizontal\" ng-submit=\"searchFormMModal.submitSearchParams(searchFormMModal.searchParams)\" name=\"searchFormMModalForm\"><fieldset class=\"search-form-m-container\" style=\"position: relative; padding: 7px;\"><div class=\"form-group form-m-number-group\"><label class=\"control-label col-md-4 col-lg-4 col-sm-4\" for=\"form-m-number\">Form M Number</label><div class=\"col-md-8 col-lg-8 col-sm-8\"><input class=\"form-control\" maxlength=\"13\" id=\"form-m-number\" min=\"0\" ng-pattern=\"/(?:mf)?\\d{4,11}/i\" ng-model=\"searchFormMModal.searchParams.number\"></div></div><div class=\"form-group applicant-group\"><label class=\"control-label col-md-4 col-lg-4 col-sm-4\" for=\"applicant\">Applicant</label><div class=\"col-md-8 col-lg-8 col-sm-8\"><input class=\"form-control\" type=\"text\" min=\"3\" id=\"applicant\" ng-model=\"searchFormMModal.searchParams.applicant\" typeahead-min-length=\"3\" uib-typeahead=\"applicant as applicant.name for applicant in searchFormMModal.getApplicant($viewValue)\"></div></div><div class=\"form-group currency-group\"><label class=\"control-label col-md-4 col-lg-4 col-sm-4\" for=\"currency\">Currency</label><div class=\"col-md-8 col-lg-8 col-sm-8\"><input class=\"form-control\" id=\"currency\" maxlength=\"3\" ng-model=\"searchFormMModal.searchParams.currency\" uib-typeahead=\"currency as currency.code for currency in searchFormMModal.getCurrency($viewValue)\" typeahead-min-length=\"2\"></div></div><div class=\"form-group amount-group\"><label class=\"control-label col-md-4 col-lg-4 col-sm-4\" for=\"amount\">Amount</label><div class=\"col-md-8 col-lg-8 col-sm-8\"><input class=\"form-control\" id=\"amount\" min=\"0\" ng-model=\"searchFormMModal.searchParams.amount\" number-format=\"\" ng-pattern=\"/^\\d[\\d,]*(?:\\.\\d*)?$/\"></div></div></fieldset><div class=\"form-m-lc-issue-container\"><span ng-click=\"searchFormMModal.toggleShowLcIssueContainer()\" class=\"form-m-lc-issue-toggle-show\"><span ng-class=\"['glyphicon', {'glyphicon-chevron-down': !searchFormMModal.showLcIssueContainer, 'glyphicon-chevron-up': searchFormMModal.showLcIssueContainer}]\"></span> {$searchFormMModal.searchLcIssuesTitle$}</span><div class=\"form-m-search-lc-issue\" ng-show=\"searchFormMModal.showLcIssueContainer\"><lc-issue lc-issue-show=\"searchFormMModal.showLcIssueContainer\" lc-issues-selected=\"searchFormMModal.selectedLcIssues\"></lc-issue></div></div><div class=\"row search-form-m-form-control\"><div class=\"col-md-4 col-lg-4 col-sm-4\" style=\"text-align: left\"><span class=\"btn btn-default\" ng-click=\"searchFormMModal.reset(searchFormMModalForm)\">Reset</span></div><div class=\"col-md-4 col-lg-4 col-sm-4\" style=\"text-align: center\"><button type=\"submit\" class=\"btn btn-info\" ng-disabled=\"searchFormMModalForm.$invalid\">Search Form M</button></div><div class=\"col-md-4 col-lg-4 col-sm-4\" style=\"text-align: right\"><span class=\"btn btn-default\" ng-click=\"searchFormMModal.close()\">Close</span></div></div></form></div>";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	/*jshint camelcase:false*/

	__webpack_require__(19)

	var rootCommons = __webpack_require__(6)

	var app = angular.module('upload-form-m',
	  ['rootApp',
	   'ui.router',
	   'upload-form-m-service'
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
	          template: __webpack_require__(20),

	          controller: 'UploadFormMController as uploadFormM'
	        }
	      }
	    })
	}

	app.controller('UploadFormMController', UploadFormMController)

	UploadFormMController.$inject = ['UploadFormM', '$timeout']

	function UploadFormMController(UploadFormM, $timeout) {
	  var vm = this

	  initial()
	  function initial() {
	    vm.formMIsUploading = false
	    vm.uploadIndicationText = 'Uploading Form Ms.........please wait'
	    vm.uploadFormMText = ''
	  }

	  vm.uploadFormM = function uploadFormM(text) {
	    vm.formMIsUploading = true

	    var uploaded = [],
	      row

	    function parseDate(dt) {
	      return '20' + dt.slice(6) + '-' + dt.slice(3, 5) + '-' + dt.slice(0, 2)
	    }

	    Papa.parse(text, {
	      delimiter: '\t',
	      header: false,
	      step: function(data) {
	        row = data.data[0]

	        uploaded.push({
	          ba: row[0],
	          mf: row[1],
	          ccy: row[2],
	          applicant: row[3],
	          fob: row[5].replace(/,/g, ''),
	          submitted_at: parseDate(row[6]),
	          validated_at: parseDate(row[7])
	        })
	      }
	    })

	    UploadFormM.save({
	      uploaded: uploaded,
	      likely_duplicates: true
	    })
	      .$promise
	      .then(formMCreatedSuccess, formMCreatedError)

	    function formMCreatedSuccess(data) {
	      var creationResult = data.created_data,
	        numCreatedNow = creationResult.length,
	        numCreatedPreviously = uploaded.length - numCreatedNow

	      vm.uploadIndicationText = 'Done Upload form Ms\n' +
	                                '=========================\n' +
	                                'Total new form Ms created: ' + numCreatedNow + '\n'
	      if (numCreatedPreviously) {
	        vm.uploadIndicationText += ('Total not created (because uploaded previously): ' + numCreatedPreviously)
	      }

	      $timeout(function() {
	        initial()
	      }, 4500)
	    }

	    function formMCreatedError(xhr) {
	      console.log(xhr);
	    }
	  }
	}


/***/ },
/* 19 */
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
	        templateUrl: __webpack_require__(4).buildUrl(
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
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"upload-form-m-tab-content\"><form class=\"upload-form-m-form\" role=\"form\" name=\"uploadFormMForm\" ng-submit=\"uploadFormM.uploadFormM(uploadFormM.uploadFormMText)\"><div class=\"form-group upload-form-m-text-group\"><pre class=\"upload-form-m-indicator\" ng-show=\"uploadFormM.formMIsUploading\">\n        {$uploadFormM.uploadIndicationText$}\n      </pre><label for=\"upload-form-m\" class=\"control-label sr-only\">Copy and paste form M</label> <textarea name=\"upload-form-m\" id=\"upload-form-m\" required=\"\" ng-model=\"uploadFormM.uploadFormMText\" ng-class=\"['form-control', 'upload-form-m', {'form-m-is-uploading':uploadFormM.formMIsUploading}]\" ng-readonly=\"uploadFormM.formMIsUploading\"></textarea></div><div class=\"upload-form-m-submit\" style=\"text-align: center\"><button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"uploadFormMForm.$invalid || uploadFormM.formMIsUploading\">Upload</button></div></form></div>";

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-m-home-view\"><div uib-tabset=\"\"><div uib-tab=\"\" ng-repeat=\"(key, tab) in tabs\" heading=\"{$tab.title$}\" active=\"tab.active\" select=\"tab.select()\"><div class=\"\" ui-view=\"{$tab.viewName$}\"></div></div></div></div>";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var rootCommons = __webpack_require__(6)

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

	      templateUrl: __webpack_require__(4).buildUrl('lc/lc.html'),

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


	__webpack_require__(23)
	__webpack_require__(24)


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/*jshint camelcase:false*/

	var rootCommons = __webpack_require__(6)

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

	      templateUrl: __webpack_require__(4).buildUrl('lc/lc-detail/lc-detail.html'),

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
/* 24 */
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
	        templateUrl: __webpack_require__(4).buildUrl('lc/search-lc/search-lc.html'),
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
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div class=\"form-m-home-view\"><div class=\"form-m-home-action-buttons btn-group-vertical\" role=\"group\"><a class=\"btn btn-info form-m-home-action-button\" ui-sref=\"lc\">Letter of credit</a> <a class=\"btn btn-info form-m-home-action-button\" ui-sref=\"form_m\">Form M</a></div></div>";

/***/ }
/******/ ]);