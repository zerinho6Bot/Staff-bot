const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ bot, message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  if (!message.channel.permissionsFor(bot.user.id).has("MANAGE_ROLES")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_I"), permission: "MANAGE_ROLES" })
    return false
  }

  if (!Profile.GuildData) {
    fastSend("Buy_errorGuildHasNoData")
    return false
  }

  if (!Object.keys(Profile.GuildBank).length < 0) {
    fastSend("Buy_errorNoOneHasData")
    return false
  }

  if (Object.keys(Profile.FindGuildSelling("roles")).length < 0 && Object.keys(Profile.FindGuildSelling("tags")).length < 0) {
    fastSend("Buy_errorNoItensInSale")
    return false
  }

  return true
}

exports.run = ({ message, fastSend, fastEmbed, args, i18n }) => {
  // ze.buy 2    3        4    5
  // ze.buy role MoruClan info
  const Profile = new CacheUtils.Profile(message.guild)
  const Roles = Profile.FindGuildSelling("roles")
  const Tags = Profile.FindGuildSelling("tags")

  if (args.length < 2) {
    if (Object.keys(Roles).length > 0) {
      fastEmbed.addField(`${i18n.__("Buy_Roles")} (${Object.keys(Roles).length})`, `\`\`${Object.keys(Roles).join("``, ``")}\`\``)
    }

    if (Object.keys(Tags).length > 0) {
      fastEmbed.addField(`${i18n.__("Buy_Tags")} (${Object.keys(Tags).length})`, `\`\`${Object.keys(Tags).join("``, ``")}\`\``)
    }

    fastEmbed.setTitle(`_${i18n.__("Buy_welcomeMessage", { guild: message.guild.name })}_`)
    // fastEmbed.setDescription("To buy something just do ``prefix.buy [role or tag] [itemName]``\nTo see info about the item use ``prefix.buy [role or tag] [itemName] info``")
    fastSend(fastEmbed, true)
    return
  }

  if (!Profile.UserBank(message.author.id) || Object.keys(Profile.UserWallet(message.author.id)).length < 0) {
    fastSend("Buy_errorNoMoney")
    return
  }

  if (args.length < 3) {
    return
  }
  
  const UserWallet = Profile.UserWallet(message.author.id)
  const UserInventory = Profile.UserInventory(message.author.id)
  const CheckFor = args[1].toLowerCase() === i18n.__("Buy_roleLiteral") ? Roles : Tags
  const CheckForStr = args[1].toLowerCase() === i18n.__("Buy_roleLiteral") ? i18n.__("Buy_roleLiteral") : i18n.__("Buy_tagLiteral")

  // Not using switch because of the eslint rule no-case-declarations, and I kinda want to optimize things you know.

  if (!CheckFor[args[2]]) {
    fastSend("Buy_errorWrongOperation", false, { argument: i18n.__("Help_SecondArgument"), itemName: args[2], itemType: CheckFor })
    return
  }

  const Item = CheckFor[args[2]]
  const ItemCoin = Item.coin
  if (!UserWallet[ItemCoin]) {
    fastSend("Buy_errorNoCoin")
    return
  }

  if (Item.value > UserWallet[ItemCoin].holds) {
    fastSend("Buy_errorNotEnough", false, { coin: ItemCoin }, true)
    return
  }

  const CheckForInInvetory = CheckForStr === i18n.__("Buy_roleLiteral") ? UserInventory.roles : UserInventory.tags
  if (CheckForInInvetory.includes(args[2].replace(/\s+/g, ""))) {
    fastSend("Buy_errorAlreadyOwns", false, { itemType: CheckForStr })
    return
  }

  if (CheckForStr === i18n.__("Buy_roleLiteral")) {
    const Member = message.guild.member(message.author.id)

    if (!Member.roles.cache.has(Item.roleId)) {
      try {
        message.guild.member(message.author.id).roles.add(Item.roleId)
      } catch (e) {
        fastSend("Buy_errorCouldntGiveRole")
        return
      }
    }
  }
  CheckForInInvetory.push(args[2])
  UserWallet[Item.coin].holds -= Item.value
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastEmbed.setDescription(i18n.__("Buy_itemGiven", { itemType: CheckForStr, itemName: args[2] }))
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Buy_itemTypeExample"), i18n.__("Buy_itemNameExample")]
  }

  return helpEmbed(message, i18n, Options)
}
