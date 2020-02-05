const Discord = require("discord.js")

/**
 * Returns a pre-built embed with Author, Color and Timestamp already defined.
 * @function
 * @param {Object} message
 * @return {Object} - The generated embed
 */
module.exports.FastEmbed = (message) => {
  const Embed = new Discord.RichEmbed()
  const Member = message.member

  Embed.setAuthor(Member.user.tag, Member.user.displayAvatarURL)
  Embed.setColor(Member.displayHexColor)
  Embed.setTimestamp()
  return Embed
}

/**
 * Configures the fastSend used in most commands.
 * @function
 * @param {Object} channel - The channel where the message came from (Only accepts guild)
 * @param {Object} translate - The i18n module already started.
 * @returns {(content: string, noTranslation: boolean, parameters: Object) => Promise<Object>}
 */
module.exports.ConfigSender = (channel, translate) => {
  /**
   * Starts typing before sending the message, then stops styping and then returns the message.
   * @async
   * @function
   * @param {string} content
   * @param {boolean} [noTranslation=false] - If you don't want the content to get translate by the i18n module
   * @param {Object} [parameters] - The context of variables to send to i18n
   * @returns {Promise<Object>} - The sent message
   */
  const Send = async (content, noTranslation, parameters) => {
    content = noTranslation ? content : translate.__(content, parameters)

    channel.startTyping(6)
    const Message = await channel.send(content)
    channel.stopTyping(true)

    return Message
  }

  return Send
}

/**
 * Gets the message from the given guild, channel and message ID.
 * @async
 * @function
 * @param {Object} bot - The Discord bot instance.
 * @param {string} guildId - The guild ID.
 * @param {string} channelId - The channel from the guild ID.
 * @param {string} messageId - The message from the channel ID.
 * @returns {(Promise<Object>|Object)} - The found message
 */
module.exports.getMessage = async (bot, guildId, channelId, messageId) => {
  const Guild = bot.guilds.get(guildId)

  if (Guild === undefined) {
    return null
  }

  const Channel = Guild.channels.get(channelId)

  if (Channel === undefined) {
    return null
  }

  try {
    const Message = await Channel.fetchMessage(messageId)
    return Message || null
  } catch { }

  return null
}

/**
 * Retuns a pre-built embed with varius informations about the command
 * @function
 * @param {Object} message
 * @param {Object} i18n
 * @param {Object} Options - Informations about the command
 * @param {number} Options.argumentsLength - How many arguments the command can have
 * @param {boolean} Options.argumentsNeeded - If the arguments that the command can have are needed for the command to run
 * @param {Array<string>} Options.argumentsFormat - A format example of each argument that the command can have.
 * @returns {Object} - The pre-built embed
 */
module.exports.helpEmbedFactory = (message, i18n, { argumentsLength, argumentsNeeded, argumentsFormat }) => {
  const Embed = exports.FastEmbed(message)
  const CallerId = require("caller-id")
  const Caller = CallerId.getData()
  const FileName = Caller.filePath.split("commands")[1].replace(/.js/gi, "").substring(1)

  if (argumentsLength > 0 ) {
    const ArgumentsRequired = ["Help_NoArgument", "Help_OneArgument", "Help_TwoArguments"]
    Embed.addField(i18n.__("Help_Info"), i18n.__("Help_ArgumentsRequired", { howMany: i18n.__(ArgumentsRequired[argumentsLength]), required: i18n.__(argumentsNeeded ? "Global_Yes" : "Global_No") }))
  }

  if (argumentsFormat.length > 0) {
    let formats = ""
    const ArgumentsIndex = ["Help_FirstArgument", "Help_SecondArgument"]

    for (let i = 0; i < argumentsFormat.length; i++) {
      formats += `° ${i18n.__(ArgumentsIndex[i])}: ${argumentsFormat[i]}\n`
    }
    Embed.addField(i18n.__("Help_ArgumentsFormat"), formats)
  }

  Embed.setTitle(i18n.__(`Literal_${FileName}`))
  Embed.setDescription(i18n.__(`${FileName}_description`))

  return Embed
}