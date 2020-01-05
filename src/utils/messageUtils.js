const Discord = require("discord.js")

/**
 * Returns a pre-built embed with Author, Color and Timestamp already defined.
 * @function
 * @param {Object} message
 * @return {Object} -- The generated embed
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
 * @param {Object} channel
 * @param {Object} translate -- The i18n module already started.
 * @returns {Object}
 */
module.exports.ConfigSender = (channel, translate) => {
  /**
   * Starts typing before sending the message, then stops styping and then returns the message.
   * @async
   * @function
   * @param {string} content
   * @param {boolean} noTranslation - If you want the content to get translate by the i18n module
   * @returns {Promise<object>} - The sent message
   */
  const Send = async (content, noTranslation) => {
    content = noTranslation ? content : translate.__(content)

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
    console.log("Returning null on guild")
    return null
  }

  const Channel = Guild.channels.get(channelId)

  if (Channel === undefined) {
    console.log("Returning null on channel")
    return null
  }

  try {
    const Message = await Channel.fetchMessage(messageId)
    return Message || null
  } catch {}

  return null
}