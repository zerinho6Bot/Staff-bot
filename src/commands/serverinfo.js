exports.run = ({ message, fastSend, fastEmbed, i18n }) => {
  fastEmbed.setTitle(message.guild.name)
  fastEmbed.addField(i18n.__("Serverinfo_members"), message.guild.memberCount, true)
  fastEmbed.addField(i18n.__("Serverinfo_owner"), `${message.guild.owner}`, true)
  fastEmbed.addField(i18n.__("Serverinfo_region"), message.guild.region, true)
  fastEmbed.addField(i18n.__("Serverinfo_guildId"), message.guild.id, true)
  fastEmbed.addField(i18n.__("Serverinfo_verificationLevel"), message.guild.verificationLevel, true)

  // if (message.guild.features.length > 0) {
    // fastEmbed.addField(i18n.__("Serverinfo_features"), message.guild.features.join(", "), true)
  // }

  if (message.guild.iconURL) {
    fastEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }))
  }

  if (message.guild.description) {
    fastEmbed.setDescription(message.guild.description)
  }

  let roles = []
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of message.guild.roles.cache) {
    if (value.name.includes("everyone")) {
      continue
    }
    roles.push(value.name)
  }

  roles = "``" + roles.join("``, ``") + "``"
  if (roles.length < 1024 && roles.length > 4) {
    fastEmbed.addField(i18n.__("Serverinfo_roles"), roles)
  } else {
    fastEmbed.addField(i18n.__("Serverinfo_roles"), message.guild.roles.cache.size, true)
  }

  if (message.guild.splashURL) {
    fastEmbed.setImage(message.guild.splashURL({ dynamic: true, size: 2048 }))
  }

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
