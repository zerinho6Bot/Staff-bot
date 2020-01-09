exports.run = ({ message, fastEmbed, fastSend }) => {
  if (message.guild.iconURL === null) {
    fastSend("No icon")
    return
  }
  fastEmbed.setImage(message.guild.iconURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Servericon"))
  fastEmbed.setDescription(i18n.__("Servericon_description"))

  return fastEmbed
}
