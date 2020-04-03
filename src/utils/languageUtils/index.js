module.exports.init = require('./init.js').init
module.exports.profileOperationAllLanguages = require('./operationLanguages.js').profileOperationAllLanguages

// Changing this will change what languages the definelanguage command accepts.
exports.acceptableLanguages = ['pt-br', 'en']

// This language will be used in case the guild doesn't have a defined langauge, be sure it exists.
exports.fallbackLanguage = 'en'
