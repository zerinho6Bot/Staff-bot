exports.condition = ({ message, fastSend }) => {
  if (message.guild.iconURL() === null) {
    fastSend('No icon')
    return false
  }

  return true
}

exports.run = ({ message, fastEmbed, fastSend }) => {
  fastEmbed.setImage(message.guild.iconURL({ size: 2048 }))
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
