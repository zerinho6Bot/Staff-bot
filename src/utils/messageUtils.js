const Discord = require("discord.js")

/**
 * Returns a pre-built embed with Author, Color and Timestamp already defined.
 * @param {object} message
 * @return {object}
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
 * @param {object} channel
 * @param {objcet} translate -- The i18n module already started.
 * @returns {object}
 */
module.exports.ConfigSender = (channel, translate) => {
  return async function Send (content, noTranslation) {
    content = noTranslation ? content : translate.__(content)

    channel.startTyping(6)
    const Message = await channel.send(content)
    channel.stopTyping(true)

    return Message
  }
}
