"use strict";

/*jshint camelcase:false*/

var MODE_SAVE = 'save'
var MODE_CLOSE = 'close';

var angular = require('angular');

var letterOfCredit = angular.module('letterOfCreditApp');

letterOfCredit.controller('LetterOfCreditEditController', LetterOfCreditEditController);

LetterOfCreditEditController.$inject = ['$scope', 'lc', 'close', 'getCurrencies', 'getCustomers']

function LetterOfCreditEditController($scope, lc, close, getCurrencies, getCustomers) {

  $scope.lc = lc;
  $scope.oldLc = angular.copy(lc)

  $scope.getCurrencies = getCurrencies;
  $scope.getCustomers = getCustomers;
  $scope.statusText = null;

  $scope.editLc = function (editedLc, statusText) {
    close({
      mode: MODE_SAVE,
      editedLc: editedLc,
      statusText: statusText
    });
  };

  $scope.close = function (oldLc) {
    $scope.lc = oldLc
    close(500);
  };
}

letterOfCredit.controller('LetterOfCreditDeleteController', LetterOfCreditDeleteController)

LetterOfCreditDeleteController.$inject = ['$scope', 'lc', 'close']

function LetterOfCreditDeleteController($scope, lc, close) {

  $scope.lc = lc;
  $scope.confirmDelete = function (response) {
    close(response, 500);
  };
  $scope.close = function () {
    close();
  };
}

letterOfCredit.directive('displayedLceesTable', displayedLceesTable);

displayedLceesTable.$inject = [
  'parseBidDate',
  'ModalService',
  'xhrErrorDisplay',
  '$location',
  'LetterOfCreditStatuses'
];

function displayedLceesTable(parseBidDate, ModalService, xhrErrorDisplay, $location,
                             LetterOfCreditStatuses) {

  return {
    restrict: 'E',
    link: link,
    scope: {lcees: '=lcList'},
    template: require('./display-lc-table.html')
  };

  function attachEvent(elm) {

    /**
     * toggle the background color of a html table row. Essentially, when a table row is clicked, its color is
     * changed (highlighted) to visually distinguish it from other rows. When the row is clicked again, the color
     * is reset except when we click on a control icon in which case the row is always highlighted.
     * @param evt
     */

    function toggleBg(evt) {
      /* jshint validthis: true */

      evt.stopPropagation();

      var $elm = $(this),
        parentTr = $elm.parents('tr');

      if (parentTr.hasClass('lc-display-tr-clicked')) {
        if (!$elm.hasClass('glyphicon')) {
          parentTr.removeClass('lc-display-tr-clicked');
        }
      } else {
        parentTr.addClass('lc-display-tr-clicked').siblings().removeClass('lc-display-tr-clicked');
      }
    }

    elm.find('tbody').on({
      click: toggleBg
    }, 'td');

    elm.find('tbody').on({
      click: toggleBg
    }, '.controls>.glyphicon');
  }

  function link($scope, elm) {
    attachEvent(elm);

    $scope.orderProp = '-bid_date';

    $scope.deleteLc = function deleteLc(lcObj) {
      ModalService.showModal(
        {
          template: require('./delete-confirmation-dialog.html'),
          controller: 'LetterOfCreditDeleteController',
          inputs: {lc: lcObj}
        }
      ).then(function (modal) {
          modal.element.dialog({
            dialogClass: 'no-close'
          });

          modal.close.then(function (shouldDelete) {
            if (shouldDelete) {
              lcObj.$delete(
                function (successData) {
                  console.log('\n\n\nsuccessData = ', successData, '\n\n\n');
                  $scope.lcees = _.without($scope.lcees, successData);
                },
                function (err) {
                  xhrErrorDisplay('Error occured while doing delete\n' + err);
                }
              )
            }
          })
        }
      )
    }

    $scope.editLcees = function editLcees(lcObj) {
      ModalService.showModal({
        template: require('./edit-lc-modal.html'),
        controller: 'LetterOfCreditEditController',
        inputs: {lc: lcObj}

      }).then(function (modal) {
        modal.element.dialog({
          dialogClass: 'no-close',
          title: 'Edit Letter of Credit ' + (lcObj.mf || lcObj.applicant_data.name),
          modal: true,
          minWidth: 705,
          minHeight: 600
        });

        modal.close.then(function (lcData) {

          switch (lcData.mode) {
            case MODE_SAVE:
            {
              if (lcData && lcData.editedLc) {
                var editedLc = lcData.editedLc;

                editedLc.bid_date = parseBidDate(editedLc.bid_date);
                editedLc.date_released = parseBidDate(editedLc.date_released);

                editedLc = restoreLc(editedLc)

                var lcToSave = angular.copy(editedLc);

                //The save API backend is not expecting these properties and will complain if we don't delete them.
                delete lcToSave.applicant_data;
                delete lcToSave.ccy_obj;

                lcToSave.$put(
                  function (data) {
                    if (lcData.statusText) {
                      createLcStatus(lcData.statusText, editedLc.url);
                    }
                  },
                  function (err) {
                    xhrErrorDisplay(err);
                  }
                );
              }
              break
            }

            case MODE_CLOSE:
            {
              //lcData.$scope.lc = lcData.oldLc
            }
          }
        });
      });
    };

    $scope.goToDetailPage = function (lcObj) {
      $location.path('details/' + lcObj.id);
    };

    function createLcStatus(text, lcUrl) {
      new LetterOfCreditStatuses({
        text: text,
        lc: lcUrl
      }).$save(function () {}, function (error) {xhrErrorDisplay(error);}
      );
    }
  }
}

/**
 * @description
 * Restores an LC object to a state suitable for presenting to user
 * When an LC object is linked to more than one view, such as when LCees are displayed in table and we click to
 * edit one of them and the LC is now displayed in the edit lc directive. Type ahead directive presents a special
 * problem in that editing attributes of the LC will not display the right attribute in the underlying view. This
 * function seeks to correct this problem.
 *
 * @param {object} lc
 *
 * @returns {object}
 */
function restoreLc(lc) {

  var ccyIdRegexp = new RegExp("\\d+$")
  var ccyId = ccyIdRegexp.exec(lc.ccy)[0]
  var ccyObjId = String(lc.ccy_obj.id)
  if (ccyId !== ccyObjId) {
    //we have changed the currency via type ahead directive
    lc.ccy = lc.ccy.replace(ccyIdRegexp, ccyObjId)
  }

  var applicantIdRegexp = new RegExp("\\d+$")
  var applicantId = applicantIdRegexp.exec(lc.applicant)[0]
  var applicantDataId = String(lc.applicant_data.id)
  if (applicantId !== applicantDataId) {
    //we have changed the applicant via type ahead directive.
    lc.applicant = lc.applicant.replace(applicantIdRegexp, applicantDataId)
  }

  return lc
}
