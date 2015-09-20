/////////////////  COMMONS ///////////////////////////////////////////
Object.defineProperty(window, 'staticPrefix', {value: '/static/'})

var commonsTestsContext = require.context('./core_recons/static/core_recons/js', true, /spec\.js$/)
commonsTestsContext.keys().forEach(commonsTestsContext)

var commonsContext = require.context('./core_recons/static/core_recons/js', true, /^index(?!spec)\.js$/)
commonsContext.keys().forEach(commonsContext)
/////////////////  COMMONS ///////////////////////////////////////////




/////////////////  PAYMENT ///////////////////////////////////////////
var paymentTestsContext = require.context('./payment/static/payment/js', true, /spec\.js$/)
paymentTestsContext.keys().forEach(paymentTestsContext)

var paymentsContext = require.context('./payment/static/payment/js', true, /^index(?!spec)\.js$/)
paymentsContext.keys().forEach(paymentsContext)

require('./payment/static/payment/js/app.js')
/////////////////  PAYMENT ///////////////////////////////////////////

/////////////////  PAYMENT ///////////////////////////////////////////
var lcTestsContext = require.context('./letter_of_credit/static/letter_of_credit/js', true, /spec\.js$/)
lcTestsContext.keys().forEach(lcTestsContext)

var lcContext = require.context('./letter_of_credit/static/letter_of_credit/js', true, /^index(?!spec)\.js$/)
lcContext.keys().forEach(lcContext)
/////////////////  PAYMENT ///////////////////////////////////////////
