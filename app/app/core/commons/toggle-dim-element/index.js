"use strict";

angular.module( 'toggle-dim-element', [] )
  .service( 'ToggleDimElement', ToggleDimElement )
function ToggleDimElement() {
  function ToggleDimElementService() {
    var self = this

    /**
     *
     * @param {*} element - jquery or jqlite element that will be dimmed
     * @param {function} cb - execute the callback after element has been dimmed
     */
    self.dim = function dimElement(element, cb) {
      element.addClass( 'ui-widget-overlay ui-front' )

      if ( cb ) {
        cb()
      }
    }

     /**
     *
     * @param {*} element - jquery or jqlite element that will be un-dimmed
     * @param {function} cb - execute the callback after element has been un-dimmed
     */
    self.unDim = function unDimElement(element, cb) {
      element.removeClass( 'ui-widget-overlay ui-front' )

      if ( cb ) {
        cb()
      }
    }
  }

  return new ToggleDimElementService()
}
