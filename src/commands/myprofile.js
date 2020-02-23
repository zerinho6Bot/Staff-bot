const { profiles } = require("../cache/index.js")
const { CacheUtils } = require("../utils/index.js")
exports.condition = ({ args, message, fastSend, i18n }) => {
  // st.myprofile [background, description, clan] newValue
  if (args.length < 3) {
    fastSend("Global_requiresArguments", false, { amount: 2 })
    return false
  }

  const Choices = [i18n.__("Myprofile_background"), i18n.__("Myprofile_description"), i18n.__("Myprofile_clan")]

  if (!isNaN(args[1]) || !Choices.includes(args[1].toLowerCase())) {
    fastSend(`${i18n.__("Currency_errorOperatorsMustBe", { argument: i18n.__("Help_FirstArgument") })} ${Choices.join(", ")}`, true)
    return false
  }

  const FixedOperator = args[1].toLowerCase()
  const Profile = new CacheUtils.Profile(message.guild)

  if (!profiles[message.author.id]) {
    profiles[message.author.id] = Profile.DefaultProfileProperties
  }
  const FixedDescription = args.splice(2, args.length - 1).join(" ")
  switch (FixedOperator) {
    case i18n.__("Myprofile_background"):
      if (!FixedDescription.match(/(https?:\/\/.*\.(?:png|jpg|gif))/i)) {
        fastSend("Myprofile_errorBackgroundTypes")
        return false
      }
      profiles[message.author.id].background = FixedDescription.match(/(https?:\/\/.*\.(?:png|jpg|gif))/i)[1]
      break
    case i18n.__("Myprofile_description"):
      if (!isNaN(FixedDescription) || FixedDescription.length > 2048) {
        fastSend("Myprofile_errorDescription")
        return false
      }
      profiles[message.author.id].description = FixedDescription
      break
    default:
      if (!isNaN(FixedDescription) || FixedDescription.length < 2 || FixedDescription.length > 6) {
        fastSend("Myprofile_errorClan")
        return false
      }
      profiles[message.author.id].clan = FixedDescription
      break
  }

  CacheUtils.write("profiles", profiles)
  fastSend("Myprofile_updated", false, { operation: args[1] })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Myprofile_operationExample"), i18n.__("Myprofile_valueExample")]
  }

  return helpEmbed(message, i18n, Options)
}
