exports.run = ({ message, fastEmbed, fastSend }) => {
  if (message.guild.iconURL === null) {
    fastSend("No icon")
    return
  }
  fastEmbed.setImage(message.guild.iconURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
