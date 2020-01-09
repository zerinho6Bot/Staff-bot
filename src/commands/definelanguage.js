const { CacheUtils, LanguageUtils } = require("../utils/index.js")
const { guildConfig } = require("../cache/index.js")

exports.condition = ({ message, fastSend, fastEmbed, args, i18n }) => {
  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend(i18n.__("Move_errorMissingPermission", { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" }), true)
    return false
  }

  if (args.length < 2) {
    fastSend(i18n.__("Definelanguage_errorForgotLanguage", { argument: i18n.__("Help_FirstArgument") }), true)
    fastSend(exports.languagesHelp({ fastEmbed, i18n }), true)
    return false
  }

  const Language = args[1].toLowerCase()

  if (!LanguageUtils.acceptableLanguages.includes(Language)) {
    fastSend(i18n.__("Definelanguage_errorUnavailableLanguage", { argument: i18n.__("Help_FirstArgument") }), true)
    return false
  }

  const GuildDatabase = guildConfig[message.guild.id]

  if (GuildDatabase && GuildDatabase.language && GuildDatabase.language === Language) {
    fastSend(i18n.__("Definelanguage_errorLanguageAlreadyDefined", { argument: i18n.__("Help_FirstArgument") }), true)
    return false
  }
  return true
}

exports.run = ({ message, fastSend, args, i18n }) => {
  const Language = args[1].toLowerCase()

  if (guildConfig[message.guild.id]) {
    guildConfig[message.guild.id].language = args[1].toLowerCase()
  } else {
    guildConfig[message.guild.id] = {
      language: Language
    }
  }

  const Result = CacheUtils.write("guildConfig", guildConfig)

  if (!Result) {
    fastSend("Definelanguage_errorWhileSettingLanguage")
    return
  }
  fastSend(i18n.__("Definelanguage_languageDefined", { language: Language }), true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed = exports.languagesHelp({ fastEmbed, i18n })
  fastEmbed.setTitle(i18n.__("Literal_Definelanguage"))
  fastEmbed.setDescription(i18n.__("Definelanguage_description"))
  fastEmbed.addField(i18n.__("Help_Info"), i18n.__("Help_ArgumentsRequired", { howMany: i18n.__("Help_OneArgument"), required: i18n.__("Global_Yes") }), true)
  fastEmbed.addField(i18n.__("Help_ArgumentsFormat"), `${i18n.__("Help_FirstArgument")}: ${i18n.__("Example_Language")}`)

  return fastEmbed
}

exports.languagesHelp = ({ fastEmbed, i18n }) => {
  fastEmbed.addField(i18n.__("Definelanguage_Languages"), "``" + LanguageUtils.acceptableLanguages.join("``, ``") + "``")

  return fastEmbed
}
