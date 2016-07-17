"use strict";

/*jshint camelcase:false*/

var app = angular.module( 'upload-treasury-allocation' )

app.value( 'requiredBlotterHeaders', {
  TRANSACTION_DEAL_SLIP: 'deal_number',
  DEAL_DATE: 'deal_date',
  SETTLEMENT_DATE: 'settlement_date',
  TRANSACTION_TYPE: 'transaction_type',
  RATE: 'naira_rate',
  CURRENCY: 'currency',
  FCY_AMOUNT: 'fcy_amount',
  PRODUCT_TYPE: 'product_type',
  CUSTOMER_NAME: 'customer_name',
  CLIENT_CATEGORY: 'client_category',
  SOURCE_OF_FUND: 'source_of_fund'
} )

app.value( 'initAttributes', {
  showPasteForm: true,
  isSaving: false,
  showParsedPastedBid: false,
  tableParams: null,
  rejectedDataList: null,
  pastedBlotter: '',
  invalidPastedTextMsg: ''
} )

app.factory( 'makeInvalidBlotterHeadersMsg', makeInvalidBlotterHeadersMsg )

function makeInvalidBlotterHeadersMsg() {
  return function makeMessage(errors) {
    return 'Pasted text missing headers:\n' + errors.map( function (header) {
        return '  - ' + header
      } ).join( '\n' )
  }
}
