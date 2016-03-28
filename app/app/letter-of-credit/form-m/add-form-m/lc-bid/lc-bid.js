"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'lc-bid', [
  'rootApp',
  'add-fx-allocation',
  'lc-bid-request',
  'kanmii-URI',
] )

app.directive( 'lcBid', lcBidDirective )

lcBidDirective.$inject = []

function lcBidDirective() {
  return {
    restrict: 'A',
    templateUrl: require( 'commons' ).buildUrl( 'letter-of-credit', 'form-m/add-form-m/lc-bid/lc-bid.html' ),
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
  'ViewBidDetail',
  'kanmiiUri',
  'urls',
  '$timeout',
]

function LcBidDirectiveController($scope, $filter, formFieldIsValid, underscore, LcBidRequest, xhrErrorDisplay,
  confirmationDialog, formMObject, resetForm2, moment, toISODate, ViewBidDetail, kanmiiUri, urls, $timeout) {
  var vm = this
  vm.formM = formMObject
  var title = 'New Bid Request'
  vm.selectedBids = {}
  var bidFormCtrlNames = ['bidMaturityDate', 'bidAmount', 'bidGoodsDescription']

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

    if ( form ) resetForm2( form, [{ form: form, elements: bidFormCtrlNames }] )
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

  vm.selectedBidNotDeleted = function selectedBidNotDeleted(selectedBids) {
    var bids = getSelectedBids( selectedBids )
    return (bids.length === 1) && !bids[0].deleted_at
  }

  vm.trashOrReinstateBid = function trashOrReinstateBid(selectedBids, action) {
    if ( vm.formM.deleted_at ) return

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
      text: 'Sure you want to ' + action + ' bid:' + text,
      title: action.toUpperCase() + ' bid ' + mf

    } ).then( function (answer) {
      if ( answer ) {

        LcBidRequest.patch( {
          id: bid.id,
          deleted_at: action === 'delete' ? toISODate( new Date() ) : null
        } ).$promise.then( trashOrReinstateBidSuccess, function trashOrReinstateBidFailure(xhr) {
          xhrErrorDisplay( xhr )
        } )
      }
    } )

    function trashOrReinstateBidSuccess() {
      action = action === 'delete' ? 'deleted' : 'reinstated'
      confirmationDialog.showDialog( {
        text: 'Bid ' + action + ' successfully:' + text,
        title: 'Bid ' + mf + ' ' + action + ' successfully',
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
    if ( vm.formM.deleted_at ) {
      vm.showAllocateFx = false
      return
    }

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

  var url = kanmiiUri( urls.lcBidRequestDownloadUrl )

  vm.downloadUrl = function downloadUrl(selectedBids) {
    var search = []

    underscore.each( selectedBids, function (selection, bidId) {
      if ( selection === true ) search.push( bidId )
    } )

    return search.length ? url.search( { bid_ids: search } ).toString() : null
  }

  vm.refreshBids = function refreshBids() {
    $timeout( function () {
      init()
      formMObject.setBids()
    }, 3000 )
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

  /**
   * If a bid has been checked or unchecked i.e vm.selectedBids has an entry with bid ID and value for checked,
   * then we pull the bid with that ID and assign the value of checked to the bid's checked attribute
   * @param selectedBids
   */
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
