const I18nModule = require("i18n-nodejs")

exports.init = (language) => {
  const I18n = new I18nModule(language, "./../../src/languages/languages.json")

  return I18n
}

exports.acceptableLanguages = ["pt-br", "en"]

exports.fallbackLanguage = "en"
