const Commands = require("../commands/index.js")

exports.run = ({ bot, message, keys, fastSend, fastEmbed, args, i18n }) => {
  if (args.length < 2) {
    fastEmbed.setTitle(i18n.__("Help_Commands"))
    fastEmbed.setDescription("``" + Object.keys(Commands).join("``, ``") + "``")

    fastSend(fastEmbed, true)
    return
  }

  const SafeCommandName = args[1].toLowerCase()
  if (!Object.keys(Commands).includes(SafeCommandName)) {
    fastSend("Help_errorCommandDontExist")
    return
  }

  if (Commands[SafeCommandName].helpEmbed === undefined) {
    fastSend("Help_errorNoHelpMade")
    return
  }

  fastSend(Commands[SafeCommandName].helpEmbed({ bot, message, keys, fastSend, fastEmbed, i18n }), true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Help"))
  fastEmbed.setDescription(i18n.__("Help_description"))
  fastEmbed.addField(i18n.__("Help_Info"), i18n.__("Help_ArgumentsRequired", { howMany: i18n.__("Help_OneArgument"), required: i18n.__("Global_No") }), true)

  return fastEmbed
}
