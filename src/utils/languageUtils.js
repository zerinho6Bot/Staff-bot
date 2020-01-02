const I18nModule = require("i18n-nodejs")

/**
 * Starts the i18n module with the given language
 * @param {string} language
 * @returns {object}
 */
exports.init = (language) => {
  const I18n = new I18nModule(language, "./../../src/languages/languages.json")

  return I18n
}

// Changing this will change what languages the definelanguage command accepts.
exports.acceptableLanguages = ["pt-br", "en"]

// This language will be used in case the guild doesn't have a defined langauge, be sure it exists.
exports.fallbackLanguage = "en"
