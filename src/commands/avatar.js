exports.run = ({ message, fastEmbed, fastSend }) => {
  fastEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Avatar"))
  fastEmbed.setDescription(i18n.__("Shows the avatar of the user who made the command or of the mentioned one"))
  fastEmbed.addField(i18n.__("Info"), "• " + i18n.__("Arguments") + ": " + i18n.__("{{howMany}}\n• Required: {{required}}", { howMany: i18n.__("Up to one"), required: i18n.__("No") }), true)
  fastEmbed.addField(i18n.__("Arguments format"), `${i18n.__("First argument")}: ${i18n.__("Example_Mention")}`)

  return fastEmbed
}
