const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ message, args, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }
  // 0st!currency 1[background, description] 2newValue
  if (args.length < 3) {
    fastSend("Global_requiresArguments", false, { amount: 2 })
    return false
  }

  const Choices = [i18n.__("Myprofile_background"), i18n.__("Myprofile_description")]

  if (!isNaN(args[1]) || !Choices.includes(args[1].toLowerCase())) {
    fastSend(`${i18n.__("Currency_errorOperatorsMustBe", { argument: i18n.__("Help_FirstArgument") })} ${Choices.join(", ")}`, true)
    return false
  }
  const FullArgument = args.slice(2).join(" ")
  switch (args[1].toLowerCase()) {
    case i18n.__("Myprofile_background"):
      if (!isNaN(args[2]) || !FullArgument.match(/(https?:\/\/.*\.(?:png|jpg|gif))/i) || FullArgument.length > 100) {
        fastSend("guildDefault_errorWrongBackgroundLink", false, { argument: i18n.__("Help_SecondArgument") })
        return false
      }
      break
    default:
      if (!isNaN(args[2]) || FullArgument.length > 1024) {
        fastSend("guildDefault_errorWrongDescriptionLink", false, { argument: i18n.__("Help_SecondArgument") })
        return false
      }
      break
  }

  return true
}

exports.run = ({ message, args, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const FullArgument = args.slice(2).join(" ")

  if (args[1] === i18n.__("Myprofile_background")) {
    Profile.GuildDefaults.background = FullArgument
  } else {
    Profile.GuildDefaults.description = FullArgument
  }

  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("guildDefault_definedGuildDefault", false, { property: args[1] })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("guildDefault_firstArgumentExample"), i18n.__("guildDefault_secondArgumentExample")]
  }

  return helpEmbed(message, i18n, Options)
}
