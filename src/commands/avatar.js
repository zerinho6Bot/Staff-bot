exports.run = ({ message, fastEmbed, fastSend }) => {
  fastEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL)
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Avatar"))
  fastEmbed.setDescription(i18n.__("Avatar_description"))
  fastEmbed.addField(i18n.__("Help_Info"), i18n.__("Help_ArgumentsRequired", { howMany: i18n.__("Help_OneArgument"), required: i18n.__("Global_No") }), true)
  fastEmbed.addField(i18n.__("Help_ArgumentsFormat"), `${i18n.__("Help_FirstArgument")}: ${i18n.__("Example_Mention")}`)

  return fastEmbed
}
