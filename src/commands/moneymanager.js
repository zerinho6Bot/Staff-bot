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
  // ze.moneymanager @user zerinhoMoney -300
  if (args.length < 4) {
    fastSend("Global_requiresArguments", false, { amount: 3 })
    return false
  }

  if (!message.mentions.users.size > 0) {
    fastSend("Moneymanager_errorNeedMention", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  const MentionedUser = message.mentions.users.first()

  if (MentionedUser.bot) {
    fastSend("Give_errorBotNotAllowed", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!Profile.UserBank(MentionedUser.id)) {
    fastSend("Moneymanager_errorUserDontHaveData", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!Object.keys(Profile.UserCoins(MentionedUser.id)).length > 0) {
    fastSend("Moneymanager_errorUserDontHaveCoin", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!isNaN(args[2]) || args[2].length > 20 || !Profile.GuildCoin(args[2])) {
    fastSend("Currency_errorInvalidCoinName", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  if (!Profile.UserCoins(MentionedUser.id).includes(args[2])) {
    fastSend("Moneymanager_errorUserDontHaveThatCoin", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  const NewHoldValue = Profile.UserWallet(MentionedUser.id)[args[2]].holds + parseInt(args[3])
  if (isNaN(args[3]) || NewHoldValue < 0) {
    fastSend("Moneymanager_invalidAmountToRemove", false, { argument: i18n.__("Help_ThirdArgument") })
    return false
  }

  return true
}

exports.run = ({ message, args, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const MentionedUser = message.mentions.users.first()

  Profile.UserWallet(MentionedUser.id)[args[2]].holds += parseInt(args[3])
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Moneymanager_editedCoin", false, { coin: args[2], name: MentionedUser.username, value: Profile.UserWallet(MentionedUser.id)[args[2]].holds })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Example_Mention"), i18n.__("Currency_SecondArgumentExample"), i18n.__("Moneymanager_ThirdArgumentExample")]
  }

  return helpEmbed(message, i18n, Options)
}
