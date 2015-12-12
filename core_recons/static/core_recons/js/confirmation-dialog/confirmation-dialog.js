"use strict";

var app = angular.module('confirmation-dialog', [
  'angularModalService'
])

app.factory('confirmationDialog', confirmationDialog)

confirmationDialog.$inject = ['ModalService', '$q']

function confirmationDialog(ModalService, $q) {

  function Conf() {
    this.showDialog = showDialog

    function showDialog(config) {
      var deferred = $q.defer()

      ModalService.showModal({
        template: require('./confirmation-dialog.html'),
        inputs: {config: config},
        controller: 'ConfirmationDialogCtrl as confirm'
      }).then(modalHandler)

      function modalHandler(modal) {
        modal.element.dialog({
          modal: true,
          dialogClass: 'no-close',
          minWidth: 500,
          title: config.title,

          close: function() {modal.controller.close(false)}
        })

        if (!config.infoOnly) modal.close.then(function(answer) {deferred.resolve(answer)})
      }

      return deferred.promise
    }
  }

  return new Conf()
}

app.controller('ConfirmationDialogCtrl', ConfirmationDialogCtrl)

ConfirmationDialogCtrl.$inject = ['config', 'close']

function ConfirmationDialogCtrl(config, close) {
  this.text = config.text
  this.infoOnly = config.infoOnly
  this.close = close
}
