const Discord = require("discord.js")

module.exports.FastEmbed = (message) => {
  const Embed = new Discord.RichEmbed()
  const Member = message.member

  Embed.setAuthor(Member.user.tag, Member.user.displayAvatarURL)
  Embed.setColor(Member.displayHexColor)
  Embed.setTimestamp()
  return Embed
}

module.exports.ConfigSender = (channel, translate) => {
  return async function Send (content, noTranslation) {
    content = noTranslation ? content : translate.__(content)

    channel.startTyping(6)
    const Message = await channel.send(content)
    channel.stopTyping(true)

    return Message
  }
}
