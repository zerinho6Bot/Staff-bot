const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ message, fastSend, args, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" })
    return false
  }

  if (!message.guild.member(message.author.id).hasPermission("MANAGE_ROLES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_ROLES" })
    return false
  }

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  // ze.unsell [role or tag] itemName
  // 1         2             3
  if (args.length < 3) {
    fastSend("Global_requiresArguments", false, { amount: 2 })
    return false
  }

  if (!isNaN(args[1]) || ![i18n.__("Buy_roleLiteral"), i18n.__("Buy_tagLiteral")].some((elem) => args[1].toLowerCase() === elem)) {
    fastSend("Iteminfo_errorInvalidItemType", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!isNaN(args[2]) || args[2].length > Profile.lengthLimit) {
    fastSend("Itemmanager_errorInvalidItemName", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  const ToDeleteStr = args[1] === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagLiteral")
  const Roles = Profile.FindGuildSelling("roles")
  const Tags = Profile.FindGuildSelling("tags")
  const ToDelete = ToDeleteStr === i18n.__("Buy_roleLiteral") ? Roles : Tags

  if (!ToDelete[args[2]]) {
    fastSend("Iteminfo_errorCouldFindItem", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  if (ToDeleteStr === "role" && message.guild.roles.get(ToDelete[args[2]].roleId).position > message.guild.member(message.author.id).highestRole.position) {
    fastSend("Unsell_errorYourPositionTooLow")
    return false
  }

  return true
}

exports.run = ({ args, message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const ToDeleteStr = args[1] === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagsLiteral")
  const Roles = Profile.FindGuildSelling("roles")
  const Tags = Profile.FindGuildSelling("tags")
  const ToDelete = ToDeleteStr === i18n.__("Buy_roleLiteral") ? Roles : Tags
  delete ToDelete[args[2]]
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Unsell_deleted", false, { itemType: ToDeleteStr, itemName: args[2] })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Buy_itemTypeExample"), i18n.__("Buy_itemNameExample")]
  }

  return helpEmbed(message, i18n, Options)
}
