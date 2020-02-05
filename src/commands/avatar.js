exports.run = ({ message, fastEmbed, fastSend }) => {
  fastEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: [i18n.__("Example_Mention")]
  }

  return helpEmbed(message, i18n, Options)
}
