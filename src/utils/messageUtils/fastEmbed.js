const Discord = require("discord.js")

/**
 * Returns a pre-built embed with Author, Color and Timestamp already defined.
 * @function
 * @param {Object} message
 * @return {Object} - The generated embed
 */
module.exports.fastEmbed = (message) => {
  const Embed = new Discord.MessageEmbed()
  const Member = message.member

  Embed.setAuthor(Member.user.tag, Member.user.displayAvatarURL({ dynamic: true }))
  Embed.setColor(Member.displayHexColor)
  Embed.setTimestamp()
  return Embed
}
