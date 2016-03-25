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
        template: require('./display-uploaded-form-m-modal.html'),
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
