/////////////////  PAYMENT ///////////////////////////////////////////
var paymentTestsContext = require.context('./payment/static/payment/js', true, /spec\.js$/)
paymentTestsContext.keys().forEach(paymentTestsContext)

var paymentsContext = require.context('./payment/static/payment/js', true, /^index(?!spec)\.js$/)
paymentsContext.keys().forEach(paymentsContext)

require('./payment/static/payment/js/app.js')
/////////////////  PAYMENT ///////////////////////////////////////////
