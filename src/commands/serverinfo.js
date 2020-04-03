exports.run = ({ message, fastSend, fastEmbed, i18n }) => {
  fastEmbed.setTitle(`${message.guild.name} (ID: ${message.guild.id})`)
  fastEmbed.addField(i18n.__('Serverinfo_members'), message.guild.memberCount, true)
  fastEmbed.addField(i18n.__('Serverinfo_owner'), `${message.guild.owner}`, true)
  fastEmbed.addField(i18n.__('Serverinfo_region'), message.guild.region, true)
  fastEmbed.addField(i18n.__('Serverinfo_verificationLevel'), message.guild.verificationLevel, true)

  const Months = [
    i18n.__('Global_January'),
    i18n.__('Global_February'),
    i18n.__('Global_March'),
    i18n.__('Global_April'),
    i18n.__('Global_May'),
    i18n.__('Global_June'),
    i18n.__('Global_July'),
    i18n.__('Global_August'),
    i18n.__('Global_September'),
    i18n.__('Global_October'),
    i18n.__('Global_November'),
    i18n.__('Global_December')
  ]
  const GuildDate = new Date(message.guild.createdTimestamp)
  fastEmbed.addField(i18n.__('Serverinfo_createdAt'), `${Months[GuildDate.getMonth()]} ${GuildDate.getDate() + 1} ${GuildDate.getFullYear()}`, true)

  if (message.guild.iconURL) {
    fastEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }))
  }

  if (message.guild.description) {
    fastEmbed.setDescription(message.guild.description)
  }

  let roles = []
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of message.guild.roles.cache) {
    if (value.name.includes('everyone')) {
      continue
    }
    roles.push(value.name)
  }

  roles = `\`\`${roles.join('``, ``')}\`\``
  if (roles.length < 1024 && roles.length > 4) {
    fastEmbed.addField(i18n.__('Serverinfo_roles'), roles)
  } else {
    fastEmbed.addField(i18n.__('Serverinfo_roles'), message.guild.roles.cache.size, true)
  }

  if (message.guild.features.length > 0) {
    fastEmbed.addField(i18n.__('Serverinfo_features'), message.guild.features.join(', '), true)
  }
  // fastEmbed.addField(i18n.__("Serverinfo_guildId"), message.guild.id, true)

  /*
  This was a neat ideia for special servers, but defining a image
  makes so the content on the embed gets higher and not wider
  since the embed wants eveything so be just as long as the image.
  if (message.guild.splashURL) {
    fastEmbed.setImage(message.guild.splashURL({ dynamic: true, size: 2048 }))
  }
  */

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
