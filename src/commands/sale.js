const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ bot, args, message, fastSend, i18n }) => {
  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" })
    return false
  }

  if (!message.guild.member(message.author.id).hasPermission("MANAGE_ROLES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_ROLES" })
    return false
  }

  if (!message.channel.permissionsFor(bot.user.id).has("MANAGE_ROLES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_I"), permission: "MANAGE_ROLES" })
    return false
  }

  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  if (args.length < 6) {
    fastSend("Global_requiresArguments", false, { amount: 5 })
    return false
  }

  return true
}

exports.run = ({ message, args, fastSend, i18n }) => {
  // ze.sale [role or tag] ItemName CoinName Value (case tag: description)
  const Profile = new CacheUtils.Profile(message.guild)
  const SellStr = args[1].toLowerCase() === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagLiteral")
  const Roles = Profile.FindGuildSelling("roles")
  const Tags = Profile.FindGuildSelling("tags")
  const Item = {
    coin: "",
    value: 0,
    name: "",
    description: ""
  }

  if ((Object.keys(Roles).length + Object.keys(Tags).length) >= 100) {
    fastSend("Profile_errorMaxItensInSale")
    return
  }

  if (!isNaN(args[3]) || args[3].length <= 0 || args[3].length > 20 || !Profile.GuildCoin(args[3])) {
    fastSend("Currency_errorInvalidCoinName", false, { argument: i18n.__("Help_ThirdArgument") })
    return
  }

  if (isNaN(args[4]) || args[4] > 66666 || args[4] <= 0) {
    fastSend("Currency_errorInvalidCoinValue", false, { argument: i18n.__("Help_FirthArgument") })
    return
  }

  if (SellStr === i18n.__("Buy_roleLiteral")) {
    if (message.guild.roles.size <= 1) {
      fastSend("Iteminfo_errorNotSellingType", false, { itemType: i18n.__("Buy_roleLiteral") })
      return
    }

    if (isNaN(args[2]) || args[2].length < 16 || args[2].length > 18) {
      fastSend("Itemmanager_errorInvalidItemName", false, { argument: i18n.__("Help_SecondArgument") })
      return
    }

    if (!message.guild.roles.cache.has(args[2])) {
      fastSend("Sale_errorRoleDontExist", false, { argument: i18n.__("Help_SecondArgument") })
      return
    }
    //
    const Member = message.guild.member(message.author.id)

    if (Member) {
      if (message.guild.roles.cache.get(args[2]).position > Member.highestRole.position) {
        fastSend("Sale_errorYourPositionTooLow", false, { argument: i18n.__("Help_SecondArgument") })
        return
      }
    }

    const Role = message.guild.roles.cache.get(args[2])

    if (Profile.FindGuildItem("roles", Role.name.replace(/\s+/g, ""))) {
      fastSend("Sale_errorRoleAlreadyInSale", false, { argument: i18n.__("Help_SecondArgument") })
      return
    }

    if ((Role.name.replace(/\s+/g, "")).length > Profile.lengthLimit) {
      fastSend("Sale_errorRoleNameIsTooBig")
      return
    }

    const FixedRoleName = Role.name.replace(/\s+/g, "")
    Roles[FixedRoleName] = Profile.DefaultRoleProperties
    const NewRole = Roles[FixedRoleName]
    NewRole.coin = args[3]
    NewRole.value = parseInt(args[4])
    NewRole.roleId = args[2];
    [Item.coin, Item.value, Item.name] = [NewRole.coin, NewRole.value, FixedRoleName]
  }

  if (SellStr === i18n.__("Buy_tagLiteral")) {
    if (args.length < 6) {
      fastSend("Sale_CreateTagArguments")
      return
    }

    if (!isNaN(args[2]) || (args[2].replace(/\s+/g, "")).length > Profile.lengthLimit) {
      fastSend("Sale_errorInvalidTagName", false, { argument: i18n.__("Help_SecondArgument") })
      return
    }

    const FixedTagName = args[2].replace(/\s+/g, "")
    // str.split(" ").splice(5, str.split(" ").length - 4).join(" ")
    const FixedDescription = args.splice(5, args.length - 4).join(" ")
    if (!isNaN(FixedDescription) || FixedDescription.length > 2048) {
      fastSend("Sale_errorInvalidTagDescription", false, { argument: i18n.__("Help_FifthArgument") })
      return
    }

    if (Profile.FindGuildItem("tags", FixedTagName)) {
      fastSend("Sale_errorTagAlreadyExists", false, { argument: i18n.__("Help_SecondArgument") })
      return
    }

    Tags[FixedTagName] = Profile.DefaultTagProperties
    const NewTag = Tags[FixedTagName]
    NewTag.coin = args[3]
    NewTag.value = parseInt(args[4])
    NewTag.description = FixedDescription;
    [Item.coin, Item.value, Item.name, Item.description] = [NewTag.coin, NewTag.value, FixedTagName, FixedDescription]
  }

  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Sale_nowSelling", false, { itemType: SellStr, name: Item.name, value: Item.value, coin: Item.coin })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 5,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Buy_itemTypeExample"), i18n.__("Buy_itemNameExample"), i18n.__("Give_SecondArgumentExample"), i18n.__("Moneymanager_ThirdArgumentExample"), i18n.__("Sale_tagDescriptionExample")]
  }

  return helpEmbed(message, i18n, Options)
}
