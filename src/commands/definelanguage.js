const { CacheUtils, LanguageUtils } = require("../utils/index.js")
const { guildConfig } = require("../cache/index.js")

exports.condition = ({ message, fastSend, args, i18n }) => {
  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend(i18n.__("You don't have {{permission}} permission", { permission: "MANAGE_GUILD" }), true)
    return false
  }

  if (args.length < 2) {
    fastSend("You forgot to send what language it should be")
    return false
  }
  const Language = args[1].toLowerCase()

  if (!LanguageUtils.acceptableLanguages.includes(Language)) {
    fastSend("That language doesn't exist or wasn't been translated for this bot yet")
    return false
  }

  const GuildDatabase = guildConfig[message.guild.id]

  if (GuildDatabase && GuildDatabase.language && GuildDatabase.language === Language) {
    fastSend("That's already the defined language for this guild")
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
    fastSend("Something happened and I wasn't able to set the language")
    return
  }
  fastSend(i18n.__("Language defined to {{language}}", { language: Language }), true)
}
