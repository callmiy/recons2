"use strict";

/*jshint camelcase:false*/

/**
 Add bid service
 */

var rootCommons = require('commons')

var app = angular.module('add-bid-service', [
  'rootApp',
  'ui.router',
  'model-table',
  'form-m-service',
  'form-m-search-service',
  'kanmii-underscore',
  'lc-bid-request',
  'edit-bid'
])

app.config(rootCommons.interpolateProviderConfig)

app.config(addBidURLConfig)
addBidURLConfig.$inject = ['$stateProvider']
function addBidURLConfig($stateProvider) {

  $stateProvider
    .state('addBid', {
      url: '/bid/add-bid',

      kanmiiTitle: 'Make Bid Request',

      template: require('./add-bid-service.html'),

      controller: 'MakeBidRequestController as makeBidRequest'
    })
}

app.controller('MakeBidRequestController', MakeBidRequestController)
MakeBidRequestController.$inject = [
  'SearchFormMService',
  'formMModelManager',
  'kanmiiUnderscore',
  '$filter',
  'LcBidRequest',
  'FormM',
  'xhrErrorDisplay',
  'EditBid',
  '$state',
  'formMAttributesVerboseNames',
  'bidAttributesVerboseNames'
]
function MakeBidRequestController(SearchFormMService, formMModelManager, kanmiiUnderscore, filter, LcBidRequest,
  FormM, xhrErrorDisplay, EditBid, state, formMAttributesVerboseNames, bidAttributesVerboseNames) {

  var vm = this

  /**
   * The form M we wish to bid for. This will be the form M instance retrieved from server
   * @type {{}}
   */
  var formMForBid = {
    goods_description: null
  }

  reset()
  function reset(form) {
    if (form) {
      form.$setPristine()
      form.$setUntouched()
    }

    vm.formMDetailShown = false
    vm.goodsInputIsEditable = false

    vm.bid = {
      mf: null,
      amount: ''
    }
  }

  vm.reset = reset

  /**
   * Required by model table directive to display bids
   * @type {[]}
   */
  vm.modelManager = formMModelManager

  /**
   * Required by model table directive as the table caption
   * @type {string}
   */
  vm.tableCaption = 'Select form M for bid request'

  /**
   * The form Ms collection from which user will make a choice. The chosen form M will be the one for which bid
   * is to be requested
   * @type {Array}
   */
  vm.formMs = []

  vm.submitBid = submitBid
  /**
   * We create a new bid from data collected from user. If we have edited the goods description (because we did not
   * provide one while saving the form M initially or we wish to change the goods description prior to creating a new
   * bid) we first update the form M with the edited goods description before creating the bid
   * @param {{}} newBid
   */
  function submitBid(newBid) {

    if (formMForBid.goods_description !== newBid.mf.goods_description) {
      formMForBid.goods_description = newBid.mf.goods_description

      FormM.put(formMForBid).$promise.then(function(data) {
        saveNewBid()
        formMForBid = data

      }, function(xhr) {
        xhrErrorDisplay(xhr, formMAttributesVerboseNames)
      })

    } else saveNewBid();

    function saveNewBid() {
      var bidToSave = {
        mf: newBid.mf.url,
        amount: newBid.amount
      }

      new LcBidRequest(bidToSave).$save(bidSavedSuccess, bidSavedError)
    }

    function bidSavedSuccess(data) {
      /**
       * `EditBid` service will display the just saved bid and will allow us to optionally edit the bid in case we
       * made mistake
       */
      EditBid.editWithModal({
        bid: data,
        formM: formMForBid,
        title: 'Bid Save Successful',
        closeCb: function(editedBid) {
          state.go('bid', {newBid: editedBid})
        }
      })
    }

    function bidSavedError(xhr) {
      xhrErrorDisplay(xhr, bidAttributesVerboseNames)
    }
  }

  vm.mfGetterSetter = function mfGetterSetter(newVal) {
    if (newVal) vm.bid.mf = newVal
    else if (!kanmiiUnderscore.isEmpty(vm.bid.mf)) return vm.bid.mf.number + ': ' + vm.bid.mf.applicant_data.name
    else return ''
  }

  vm.amountGetterSetter = function amountGetterSetter(newVal) {
    if (newVal) {
      vm.bid.amount = Number(String(newVal).replace(',', ''))
    }
    else if (vm.bid.amount) return filter('number')(vm.bid.amount, 2)
    else return ''
  }

  vm.dateReceivedGetterSetter = function dateReceivedGetterSetter(val) {
    if (val) vm.bid.mf.date_received = new Date(val)
    else if (vm.bid.mf) return filter('date')(vm.bid.mf.date_received, 'dd-MMM-yyyy')
    else return ''
  }

  vm.onSelectFormM = onSelectFormM
  function onSelectFormM(rowModel) {
    formMForBid = angular.copy(rowModel)

    vm.mfGetterSetter(rowModel)
    if (!vm.bid.number) vm.amountGetterSetter(rowModel.amount)

    vm.dateReceivedGetterSetter(rowModel.date_received)

    vm.formMs = [rowModel]
  }

  vm.getFormM = function getFormM() {

    SearchFormMService.searchWithModal().then(function(data) {
      var results = data.results
      if (results.length) {
        if (results.length === 1) {
          vm.onSelectFormM(results[0])

        } else {
          vm.formMs = results
          vm.paginationHooks = {
            next: data.next,
            previous: data.previous,
            count: data.count
          }
        }
      }
    })
  }

  vm.toggleShowFormMDetail = function toggleShowFormMDetail() {
    vm.formMDetailShown = !vm.formMDetailShown
  }

  vm.toggleEditGoods = toggleEditGoods
  function toggleEditGoods() {
    vm.goodsInputIsEditable = !vm.goodsInputIsEditable && vm.bid.mf && vm.bid.mf.number ? true : false
  }
}
