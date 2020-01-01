exports.run = ({ message, fastEmbed, fastSend }) => {
  fastEmbed.setImage(message.author.displayAvatarURL)
  fastSend(fastEmbed, true)
}
