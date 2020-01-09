/**
 * Splits the message content.
 * @function
 * @param {object} message 
 * @returns {Array<String>} - Returns a array made of the message splited, it'll be called args by many functions.
 */
const Args = (message) => {
  return message.content.split(" ")
}

/**
 * Gets the command name from the args array.
 * @function
 * @param {Array<String>} args - The message splited.
 * @param {object} keys - The env. process.
 * @returns {string} - The command name.
 */
const CommandName = (args, keys) => {
  return args[0].toLowerCase().slice(keys.PREFIX.length)
}

const { guildConfig } = require("../cache/index.js")
const { LanguageUtils, MessageUtils } = require("../utils/index.js")
const Commands = require("../commands/index.js")

exports.condition = (message, keys, bot) => {
  if (message.channel.type === "dm" || !message.content.toLowerCase().startsWith(keys.PREFIX)) {
    return false
  }

  if (message.author.bot) {
    return false
  }

  const GuildDefinedLanguage = guildConfig[message.guild.id] && guildConfig[message.guild.id].language ? 
  guildConfig[message.guild.id].language : ""
  const Send = MessageUtils.ConfigSender(message.channel, LanguageUtils.init(GuildDefinedLanguage === "" ? LanguageUtils.fallbackLanguage : GuildDefinedLanguage))
  if (!message.channel.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
    try {
      message.author.send("Message_errorImpossibleReply")
    } catch { }
    return false
  }

  if (!message.channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
    Send("Message_errorMissingEmbedLinks")
    return false
  }

  const SafeCommandName = CommandName(Args(message), keys)

  if (!SafeCommandName) {
    return false
  }

  if (!Object.keys(Commands).includes(SafeCommandName)) {
    Send("Help_errorCommandDontExist")
    return
  }

  return true
}

exports.run = async (message, keys, bot) => {
  const SafeArgs = Args(message)
  const SafeCommandName = CommandName(SafeArgs, keys)
  const Command = Commands[SafeCommandName]
  const GuildDefinedLanguage = guildConfig[message.guild.id] && guildConfig[message.guild.id].language ? 
  guildConfig[message.guild.id].language : ""
  const I18n = LanguageUtils.init(GuildDefinedLanguage === "" ? LanguageUtils.fallbackLanguage : GuildDefinedLanguage)
  const Send = MessageUtils.ConfigSender(message.channel, I18n)
  const Arguments = { message, keys, bot, args: SafeArgs, fastEmbed: MessageUtils.FastEmbed(message), fastSend: Send, i18n: I18n }

  if (Command.condition !== undefined) {
    const Condition = await Command.condition(Arguments)

    if (!Condition) {
      return
    }
  }
  Commands[SafeCommandName].run(Arguments)
}
