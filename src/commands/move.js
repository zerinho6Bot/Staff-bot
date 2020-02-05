const ChannelRegex = /<#([0-9]{16,18})>/
const MessageRegex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
const { MessageUtils } = require("../utils/index.js")
const Discord = require("discord.js")

exports.condition = async ({ bot, message, fastSend, args, i18n }) => {
  if (args.length < 3) {
    fastSend(i18n.__("Move_errorNoLink", { argument: i18n.__("Global_MissingArgument") }), true)
    return false
  }

  const Match = args[1].match(MessageRegex)

  if (Match === null) {
    fastSend("Move_errorWrongLink", false, { argument: i18n.__("Help_FirstArgument"), link: "<https://discordapp.com/channels/298518634765221890/619683328919863307/662814539548590112>" })
    return false
  }

  let channel = args[2].match(ChannelRegex)

  if (channel === null) {
    fastSend("Move_errorInvalidChannel", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  channel = channel[channel.length - 1]
  if (!message.guild.channels.has(channel)) {
    fastSend("Move_errorChannelDontExist", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  channel = message.guild.channels.get(channel)

  if (channel === undefined) {
    fastSend("Move_errorDintGetChannel", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  const GivenMessage = await MessageUtils.getMessage(bot, Match[1], Match[2], Match[3])
  if (GivenMessage === null) {
    fastSend("Move_errorDintGetMessage")
    return false
  }

  if (!channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_I"), permission: "MANAGE_MESSAGES" })
    return false
  }

  if (!channel.permissionsFor(message.author.id).has("MANAGE_MESSAGES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_MESSAGES" })
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
    fastSend("Move_errorMissingPermissionOnChannel", false, { who: i18n.__("Global_I"), permission: "MANAGE_MESSAGES" })
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
    fastSend("Move_errorMissingPermissionOnChannel", false, { who: i18n.__("Global_I"), permission: "SEND_MESSAGES" })
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
    fastSend("Move_errorMissingPermissionOnChannel", false, { who: i18n.__("Global_I"), permission: "EMBED_LINKS" })
    return false
  }

  if (!GivenMessage.channel.permissionsFor(message.author.id).has("MANAGE_MESSAGES")) {
    fastSend("Move_errorMissingPermissionOnChannel", false, { who: i18n.__("Global_You"), permission: "MANAGE_MESSAGES" })
    return false
  }

  if (GivenMessage.channel.nsfw && !channel.nsfw) {
    fastSend("Move_errorMovingNsfw", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  return true
}

exports.run = async ({ bot, message, fastSend, fastEmbed, args, i18n }) => {
  const Match = args[1].match(MessageRegex)
  const MatchChannel = args[2].match(ChannelRegex)
  const Channel = message.guild.channels.get(MatchChannel[1])
  const GivenMessage = await MessageUtils.getMessage(bot, Match[1], Match[2], Match[3])

  if (GivenMessage.embeds.length < 1) {
    try {
      if (GivenMessage.content.length > 0) {
        Channel.send(i18n.__("Move_MessageSent", { user: GivenMessage.author.tag, channel: GivenMessage.channel, moderator: message.author.tag }))
        Channel.send(GivenMessage.content)
      }

      if (GivenMessage.attachments.size >= 1) {
        Channel.send(new Discord.Attachment(GivenMessage.attachments.last().url))
      }
      GivenMessage.delete()
    } catch (e) {
      fastSend("Move_errorInMainOperation", false, { error: e })
    }
    return
  }

  const DataFrom = GivenMessage.embeds[0] // Had errors doing fastEmbed = GivenMessage.embeds[0]
  fastEmbed.fields = DataFrom.fields
  fastEmbed.title = DataFrom.title
  fastEmbed.description = DataFrom.description
  fastEmbed.url = DataFrom.url
  fastEmbed.timestamp = DataFrom.timestamp
  fastEmbed.color = DataFrom.color
  fastEmbed.video = DataFrom.video
  fastEmbed.image = DataFrom.image
  fastEmbed.thumbnail = DataFrom.thumbnail
  fastEmbed.author = DataFrom.author

  try {
    Channel.send(fastEmbed)
    GivenMessage.delete()
  } catch (e) {
    fastSend("Move_errorInMainOperation", false, { error: e })
  }
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: ["``https://discordapp.com/channels/298518634765221890/619683328919863307/662814539548590112``", i18n.__("Example_Channel")]
  }

  return helpEmbed(message, i18n, Options)
}
