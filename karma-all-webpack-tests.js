/////////////////  COMMONS ///////////////////////////////////////////
Object.defineProperty( window, 'staticPrefix', { value: '/static/' } )

var commonsTestsContext = require.context( './app/ap', true, /spec\.js$/ )
commonsTestsContext.keys().forEach( commonsTestsContext )

var commonsContext = require.context( './app/app', true, /^index(?!spec)\.js$/ )
commonsContext.keys().forEach( commonsContext )
/////////////////  COMMONS ///////////////////////////////////////////

/////////////////  LETTER OF CREDIT ///////////////////////////////////////////
var lcTestsContext = require.context( './app/app/letter-of-credit', true, /spec\.js$/ )
lcTestsContext.keys().forEach( lcTestsContext )

var lcContext = require.context( './app/app/letter-of-credit', true, /^index(?!spec)\.js$/ )
lcContext.keys().forEach( lcContext )
/////////////////  LETTER OF CREDIT ///////////////////////////////////////////
