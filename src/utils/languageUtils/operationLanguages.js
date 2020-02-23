/**
 * Gets all possible operations for the currency command.
 * @function
 * @returns {Array<String>} - All the possible operations strings.
 */
exports.profileOperationAllLanguages = () => {
  const Operations = []
  const LanguageUtils = require("./index.js")
  for (let i = 0; i < LanguageUtils.acceptableLanguages.length; i++) {
    const I18n = LanguageUtils.init(LanguageUtils.acceptableLanguages.length[i])
    Operations.push([I18n.__("Currency_Create"), I18n.__("Currency_Edit"), I18n.__("Currency_Delete")])
  }

  return Operations
}
