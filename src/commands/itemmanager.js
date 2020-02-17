const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ args, message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" })
    return false
  }

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  if (!Profile.GuildData) {
    fastSend("Buy_errorGuildHasNoData")
    return false
  }
  // ze.moneymanager @user [role, tag] itemName [remove, add]

  if (args.length < 5) {
    fastSend("Global_requiresArguments", false, { amount: 4 })
    return false
  }

  const GuildStore = Profile.GuildSales
  const Roles = GuildStore.roles
  const Tags = GuildStore.tags

  if (!message.mentions.users.size > 0) {
    fastSend("Give_errorNeedMention", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  const MentionedUser = message.mentions.users.first()

  if (MentionedUser.bot) {
    fastSend("Give_errorBotNotAllowed", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!isNaN(args[2]) || ![i18n.__("Buy_roleLiteral"), i18n.__("Buy_tagLiteral")].some((elem) => args[2].toLowerCase() === elem)) {
    fastSend("Iteminfo_errorInvalidItemType", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  const FixedOperation = args[2].toLowerCase()
  const SearchForStr = FixedOperation === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagLiteral")
  const SearchFor = SearchForStr === i18n.__("Buy_roleLiteral") ? Roles : Tags

  if (!Object.keys(SearchFor).length > 0) {
    fastSend("Itemmanager_errorNoTypeToManage", false, { argument: i18n.__("Help_SecondArgument"), itemType: FixedOperation })
    return false
  }

  const ItemName = args[3].replace(/\s+/g, "")

  if (!isNaN(ItemName) || ItemName.length > 20) {
    fastSend("Itemmanager_errorInvalidItemName", false, { argument: i18n.__("Help_ThirdArgument") })
    return false
  }

  const MentionedUserInventory = Profile.UserInventory(MentionedUser.id)

  if (!MentionedUserInventory) {
    fastSend("Itemmanager_errorUserDontHaveInventory")
    return false
  }

  const MentionedUserRoles = MentionedUserInventory.roles
  const MentionedUserTags = MentionedUserInventory.tags
  const SearchIn = SearchForStr === i18n.__("Buy_roleLiteral") ? MentionedUserRoles : MentionedUserTags

  if (!isNaN(args[4]) || ![i18n.__("Itemmanager_remove"), i18n.__("Itemmanager_add")].some((elem) => args[4].toLowerCase() === elem)) {
    fastSend("Itemmanager_errorInvalidOperation", false, { argument: i18n.__("Help_FourthArgument") })
    return false
  }

  const Operation = args[4].toLowerCase() === i18n.__("Itemmanager_remove") ? i18n.__("Itemmanager_remove") : i18n.__("Itemmanager_add")

  if (Operation === i18n.__("Itemmanager_remove")) {
    if (!SearchIn.includes(ItemName)) {
      fastSend("Itemamanager_errorCoundFindOnUserInventory", false, { argument: i18n.__("Help_FourthArgument"), itemType: SearchForStr, name: MentionedUser.username })
      return false
    }

    const Index = SearchIn.indexOf(ItemName)

    if (!(Index > -1)) { // Love javascript
      fastSend("Itemamanager_errorCoundFindOnUserInventory", false, { argument: i18n.__("Help_FourthArgument"), itemType: SearchForStr, name: MentionedUser.username })
      return false
    }
  }

  if (Operation === "add" && SearchIn.includes(ItemName)) {
    fastSend("Itemmanager_errorUserAlreadyOwns")
    return false
  }
  return true
}

exports.run = ({ args, message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const MentionedUser = message.mentions.users.first()
  const MentionedUserInventory = Profile.UserInventory(MentionedUser.id)
  const MentionedUserRoles = MentionedUserInventory.roles
  const MentionedUserTags = MentionedUserInventory.tags
  const SearchForStr = args[2].toLowerCase() === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagLiteral")
  const SearchIn = SearchForStr === i18n.__("Buy_roleLiteral") ? MentionedUserRoles : MentionedUserTags
  const Operation = args[4].toLowerCase() === i18n.__("Itemmanager_remove") ? i18n.__("Itemmanager_remove") : i18n.__("Itemmanager_add")
  const ItemName = args[3].replace(/\s+/g, "")

  if (Operation === i18n.__("Itemmanager_remove")) {
    SearchIn.splice(SearchIn.indexOf(ItemName), 1)
  } else {
    SearchIn.push(ItemName)
  }

  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend(`${Operation === i18n.__("Itemmanager_remove") ? i18n.__("Itemmanager_removed") : i18n.__("Itemmanager_added")} ${ItemName} ${SearchForStr} ${i18n.__("Itemmanager_from")} ${MentionedUser.username}`, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 4,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Example_Mention"), i18n.__("Buy_itemTypeExample"), i18n.__("Iteminfo_SecondArgument"), i18n.__("Itemmanager_FourthArgument")]
  }

  return helpEmbed(message, i18n, Options)
}
