const ChannelRegex = /<#([0-9]{16,18})>/
const MessageRegex = /https:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
const { MessageUtils } = require("../utils/index.js")
const Discord = require("discord.js")

exports.condition = async ({ bot, message, fastSend, args, i18n }) => {
  if (args.length < 3) {
    fastSend(i18n.__("{{argument}}, you forgot to send the message link and/or the channel where it should be sent to", { argument: i18n.__("Missing argument") }), true)
    return false
  }

  const Match = args[1].match(MessageRegex)

  if (Match === null) {
    fastSend(i18n.__("{{argument}}, something is wrong with the link you've sent, it should look like this {{link}}", { argument: i18n.__("First argument"), link: "<https://discordapp.com/channels/298518634765221890/619683328919863307/662814539548590112>" }), true)
    return false
  }

  let channel = args[2].match(ChannelRegex)

  if (channel === null) {
    fastSend(i18n.__("{{argument}}, Not a valid channel", { argument: i18n.__("Second argument") }), true)
    return false
  }

  channel = channel[channel.length - 1]
  if (!message.guild.channels.has(channel)) {
    fastSend(i18n.__("{{argument}}, that channel doesn't exist on this guild", { argument: i18n.__("Second argument") }), true)
    return false
  }

  channel = message.guild.channels.get(channel)

  if (channel === undefined) {
    fastSend(i18n.__("{{argument}}, error while trying to get the channel", { argument: i18n.__("Second argument") }), true)
    return false
  }

  const GivenMessage = await MessageUtils.getMessage(bot, Match[1], Match[2], Match[3])
  if (GivenMessage === null) {
    fastSend("I could not get the message, this might be that I can't read the channel, message or the Discord API din't send me the message")
    return false
  }

  if (!channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission", { who: i18n.__("I"), permission: "MANAGE_MESSAGES" }), true)
    return false
  }

  if (!channel.permissionsFor(message.author.id).has("MANAGE_MESSAGES")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission", { who: i18n.__("You"), permission: "MANAGE_MESSAGES" }), true)
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission on the given message channel", { who: i18n.__("I"), permission: "MANAGE_MESSAGES" }), true)
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission on the given message channel", { who: i18n.__("I"), permission: "SEND_MESSAGES" }), true)
    return false
  }

  if (!GivenMessage.channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission on the given message channel", { who: i18n.__("I"), permission: "EMBED_LINKS" }), true)
    return false
  }

  if (!GivenMessage.channel.permissionsFor(message.author.id).has("MANAGE_MESSAGES")) {
    fastSend(i18n.__("{{who}} don't have {{permission}} permission on the given message channel", { who: i18n.__("You"), permission: "MANAGE_MESSAGES" }), true)
    return false
  }

  if (GivenMessage.channel.nsfw && !channel.nsfw) {
    fastSend(i18n.__("{{argument}}, you're trying to move a message from a nsfw channel to a not nsfw channel", { argument: i18n.__("First argument") }), true)
    return false
  }

  return true
}

exports.run = async ({ bot, message, fastEmbed, args, i18n }) => {
  const Match = args[1].match(MessageRegex)
  const MatchChannel = args[2].match(ChannelRegex)
  const Channel = message.guild.channels.get(MatchChannel[1])
  const GivenMessage = await MessageUtils.getMessage(bot, Match[1], Match[2], Match[3])

  try {
    GivenMessage.delete()
  } catch {}

  if (1 > GivenMessage.embeds.length) {
    if (GivenMessage.content.length > 0) {
      Channel.send(i18n.__("Message sent by {{user}} from {{channel}} moved by {{moderator}}", { user: GivenMessage.author.tag, channel: GivenMessage.channel, moderator: message.author.tag }))
      Channel.send(GivenMessage.content)
    }

    if (GivenMessage.attachments.size >= 1) {
      try {
        Channel.send(new Discord.Attachment(GivenMessage.attachments.last().url))
      } catch {}
    }

    return
  }

  const DataFrom = GivenMessage.embeds[0] // Had errors doing fastEmbed = GivenMessage.embeds[0]
  fastEmbed.fields = DataFrom.fields;
	fastEmbed.title = DataFrom.title;
	fastEmbed.description = DataFrom.description;
	fastEmbed.url = DataFrom.url;
	fastEmbed.timestamp = DataFrom.timestamp;
	fastEmbed.color = DataFrom.color;
	fastEmbed.video = DataFrom.video;
	fastEmbed.image = DataFrom.image;
	fastEmbed.thumbnail = DataFrom.thumbnail;
	fastEmbed.author = DataFrom.author;
	Channel.send(fastEmbed);
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Move"))
  fastEmbed.setDescription(i18n.__("Move_description"))// Moves a message from a channel to another
  fastEmbed.addField(i18n.__("Info"), "• " + i18n.__("Arguments") + ": " + i18n.__("{{howMany}}\n• Required: {{required}}", { howMany: i18n.__("Help_TwoArguments"), required: i18n.__("No") }), true)
  fastEmbed.addField(i18n.__("Arguments format"), `${i18n.__("First argument")}: \`\`https://discordapp.com/channels/298518634765221890/619683328919863307/662814539548590112\`\`\n
  ${i18n.__("Second argument")}: ${i18n.__("Example_Channel")}`)

  return fastEmbed
}
