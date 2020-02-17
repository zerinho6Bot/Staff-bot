const { CacheUtils, LanguageUtils } = require("../utils/index.js")
const { guildConfig } = require("../cache/index.js")

exports.condition = ({ message, fastSend, fastEmbed, args, i18n }) => {
  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" })
    return false
  }

  if (args.length < 2) {
    fastSend("Definelanguage_errorForgotLanguage", false, { argument: i18n.__("Help_FirstArgument") })
    fastSend(exports.languagesHelp({ fastEmbed, i18n }), true)
    return false
  }

  const Language = args[1].toLowerCase()

  if (!LanguageUtils.acceptableLanguages.includes(Language)) {
    fastSend("Definelanguage_errorUnavailableLanguage", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  const GuildDatabase = guildConfig[message.guild.id]

  if (GuildDatabase && GuildDatabase.language && GuildDatabase.language === Language) {
    fastSend("Definelanguage_errorLanguageAlreadyDefined", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }
  return true
}

exports.run = ({ message, fastSend, args }) => {
  const Language = args[1].toLowerCase()
  const DefaultProperties = CacheUtils.getDefaultGuildProperties

  if (!guildConfig[message.guild.id]) {
    guildConfig[message.guild.id].language = DefaultProperties
  }
  guildConfig[message.guild.id].language = Language

  const Result = CacheUtils.write("guildConfig", guildConfig)

  if (!Result) {
    fastSend("Definelanguage_errorWhileSettingLanguage")
    return
  }
  fastSend("Definelanguage_languageDefined", false, { language: Language })
}

exports.helpEmbed = ({ message, fastEmbed, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: [i18n.__("Example_Language")]
  }

  const Embed = helpEmbed(message, i18n, Options)
  Embed.fields[Embed.fields.length] = exports.languagesHelp({ fastEmbed, i18n }).fields[0]

  return Embed
}

exports.languagesHelp = ({ fastEmbed, i18n }) => {
  fastEmbed.addField(i18n.__("Definelanguage_Languages"), "``" + LanguageUtils.acceptableLanguages.join("``, ``") + "``")

  return fastEmbed
}
