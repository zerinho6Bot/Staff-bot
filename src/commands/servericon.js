exports.run = ({ message, fastEmbed, fastSend }) => {
  if (message.guild.iconURL === null) {
    fastSend("No icon")
    return
  }
  fastEmbed.setImage(message.guild.iconURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle("Literal_Servericon")
  fastEmbed.setDescription("Shows the icon of the guild where the command is executed")

  return fastEmbed
}
