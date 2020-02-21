const I18nModule = require("i18n-nodejs")

/**
 * Starts the i18n module with the given language.
 * @function
 * @param {string} language - One of the strings included on acceptableLanguages
 * @returns {object}
 */
exports.init = (language) => {
  const Path = require("path")
  const I18n = new I18nModule(language, Path.join(__dirname, "../languages/languages.json"))
  return I18n
}

// Changing this will change what languages the definelanguage command accepts.
exports.acceptableLanguages = ["pt-br", "en"]

// This language will be used in case the guild doesn't have a defined langauge, be sure it exists.
exports.fallbackLanguage = "en"

/**
 * Gets all possible operations for the currency command.
 * @function
 * @returns {Array<String>} - All the possible operations strings.
 */
exports.profileOperationAllLanguages = () => {
  const Operations = []
  for (let i = 0; i < exports.acceptableLanguages.length; i++) {
    const I18n = exports.init(exports.acceptableLanguages.length[i])
    Operations.push([I18n.__("Currency_Create"), I18n.__("Currency_Edit"), I18n.__("Currency_Delete")])
  }

  return Operations
}
