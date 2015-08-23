"use strict";

angular
  .module('letterOfCreditApp')
  .factory('parseBidDate', parseBidDate);

function parseBidDate() {
  return function(bidDate) {
    //bid date is a date string and not datetime
    if ((typeof bidDate === 'string') && /\d{4}-\d{2}-\d{2}/.test(bidDate)) {
      return bidDate;
    } else if (bidDate instanceof Date) {
      return bidDate.strftime('%Y-%m-%d');
    }

    return null;
  };
}
