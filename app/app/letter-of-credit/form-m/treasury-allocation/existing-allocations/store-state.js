var underscore = require( 'underscore' )

function getParams(vm, initialState) {
  return function () {
    var obj = {}

    underscore.each( initialState, function (val, attr) {
      obj[ attr ] = vm[ attr ]
    } )
    return obj
  }
}

function onParamsChanged(vm, initialState, formMAppStore) {
  var obj = {}

  underscore.each( initialState, function (val, attr) {
    obj[ attr ] = vm[ attr ]
  } )

  formMAppStore.treasuryAllocation.uploadAllocationParams = obj
}

module.exports = {
  getParams: getParams,
  onParamsChanged: onParamsChanged
}
