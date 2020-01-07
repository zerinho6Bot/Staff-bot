const Commands = require("../commands/index.js")

exports.run = ({ bot, message, keys, fastSend, fastEmbed, args, i18n }) => {
  if (args.length < 2) {
    fastEmbed.setTitle(i18n.__("Commands"))
    fastEmbed.setDescription("``" + Object.keys(Commands).join("``, ``") + "``")

    fastSend(fastEmbed, true)
    return
  }

  const SafeCommandName = args[1].toLowerCase()
  if (!Object.keys(Commands).includes(SafeCommandName)) {
    fastSend("Sorry, that command doesn't exist")
    return
  }

  if (Commands[SafeCommandName].helpEmbed === undefined) {
    fastSend("That command doesn't have a help defined for it yet")
    return
  }

  fastSend(Commands[SafeCommandName].helpEmbed({ bot, message, keys, fastSend, fastEmbed, i18n }), true)
}

exports.helpEmbed = ({ fastEmbed, i18n }) => {
  fastEmbed.setTitle(i18n.__("Literal_Help"))
  fastEmbed.setDescription(i18n.__("Shows a list of available commands or informations about the given command"))
  fastEmbed.addField(i18n.__("Info"), "• " + i18n.__("Arguments") + ": " + i18n.__("{{howMany}}\n• Required: {{required}}", { howMany: i18n.__("Up to one"), required: i18n.__("No") }), true)
  // fastEmbed.addField(i18n.__("Needs Permission"), i18n.__("No"), true)

  return fastEmbed
}
