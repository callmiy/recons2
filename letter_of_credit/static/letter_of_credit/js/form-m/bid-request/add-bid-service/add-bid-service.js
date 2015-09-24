"use strict";

/**
 Add bid service
 */

var rootCommons = require('commons')

var app = angular.module('add-bid-service', [
  'ui.router',
  'model-table',
  'form-m-service',
  'form-m-search-service',
  'kanmii-underscore'
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
  'resetForm',
  '$filter'
]
function MakeBidRequestController(SearchFormMService, formMModelManager, kanmiiUnderscore, resetForm, filter) {
  var vm = this

  initForm()
  function initForm() {
    vm.bid = {
      mf: {},
      currency: '@',
      amount: ''
    }
  }

  vm.modelManager = formMModelManager

  vm.tableCaption = 'Select one form M for bid request'

  /**
   * The form Ms collection from which user will make a choice. The chosen form M will be the one for which bid
   * is to be requested
   * @type {Array}
   */
  vm.formMs = []

  vm.submitBid = submitBid
  function submitBid(newBid) {
    console.log('newBid = ', newBid);
    console.log('existingGoodsDescription = ', existingGoodsDescription);
  }

  vm.mfGetterSetter = function mfGetterSetter(newVal) {
    if (angular.isDefined(newVal)) vm.bid.mf = newVal
    else if (!kanmiiUnderscore.isEmpty(vm.bid.mf)) return vm.bid.mf.number + ': ' + vm.bid.mf.applicant_data.name
    else return ''
  }

  vm.amountGetterSetter = function amountGetterSetter(newVal) {
    if (newVal) {
      vm.bid.number = Number(String(newVal).replace(',', ''))
    }
    else if (vm.bid.number) return filter('number')(vm.bid.number, 2)
    else return ''
  }

  /**
   * the goods description of the form M retrieved from the server will be cached here. This is because before
   * submitting bid, we will compare its value to that of `bid.goods_description` (which is editable by user). If the
   * values are different, then we will update the goods description of the form M with the value of
   * `bid.goods_description`
   * @type {null}
   */
  var existingGoodsDescription = null

  vm.onSelectFormM = onSelectFormM
  function onSelectFormM(rowModel) {
    vm.mfGetterSetter(rowModel)
    vm.bid.currency = rowModel.currency_data.code
    vm.bid.goods_description = rowModel.goods_description
    existingGoodsDescription = rowModel.goods_description
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

  vm.reset = function reset(form) {
    initForm()
    form.$setPristine()
    form.$setUntouched()
  }
}
