const { CacheUtils } = require("../utils/index.js")

exports.condition = ({ message, fastSend, args, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  const GuildCoins = Profile.GuildCoins
  if (!Profile.UserBank(message.author.id) || Object.keys(Profile.UserWallet(message.author.id)).length <= 0) {
    fastSend("Buy_errorNoMoney")
    return false
  }

  const UserWallet = Profile.UserWallet(message.author.id)
  const UserWalletCoins = Profile.UserCoins(message.author.id)
  let EmptyCoins = 0
  for (let i = 0; i < UserWalletCoins.length; i++) {
    if (UserWallet[UserWalletCoins[i]].holds <= 0) {
      EmptyCoins++
    }
  }

  if (EmptyCoins >= (UserWalletCoins.length - 1)) {
    fastSend("Give_errorCoinsInWalletEmpty")
    return false
  }
  // 0       1     2            3
  // ze.give @user zerinhoMoney 200
  if (args.length < 4) {
    fastSend("Global_requiresArguments", false, { amount: 3 })
    return false
  }

  if (!message.mentions.users.size > 0) {
    fastSend("Give_errorNeedMention", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (message.mentions.users.first().bot) {
    fastSend("Give_errorBotNotAllowed", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (message.mentions.users.first().id === message.author.id) {
    fastSend("Give_errorCantGiveToYourself", false, { argument: i18n.__("Help_FirstArgument") })
    return false
  }

  if (!isNaN(args[2]) || args[2].length > Profile.lengthLimit || !Object.keys(GuildCoins).includes(args[2])) {
    fastSend("Currency_errorInvalidCoinName", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  if (!UserWallet[args[2]]) {
    fastSend("Buy_errorNoCoin")
    return false
  }

  if (isNaN(args[3]) || args[3] < 1) {
    fastSend("Give_errorWrongAmount", false, { argument: i18n.__("Help_ThirdArgument") })
    return false
  }

  if (args[3] > UserWallet[args[2]].holds) {
    fastSend("Give_errorGivingMore", false, { argument: i18n.__("Help_SecondArgument") })
    return false
  }

  const MentionedUser = message.mentions.users.first()
  if (!Profile.UserBank(MentionedUser.id)) {
    Profile.GuildBank[MentionedUser.id] = Profile.DefaultUserBankProperties
  }

  if (!Profile.UserWallet(MentionedUser.id)[args[2]]) {
    Profile.UserWallet(MentionedUser.id)[args[2]] = Profile.DefaultMoneyProperties
  }
  return true
}

exports.run = ({ message, args, fastSend }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const MentionedUser = message.mentions.users.first()
  const ParsedMoney = parseInt(args[3])
  Profile.UserWallet(MentionedUser.id)[args[2]].holds += ParsedMoney
  Profile.UserWallet(message.author.id)[args[2]].holds -= ParsedMoney
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Give_sentMoney", false, { amount: args[3], coin: args[2], name: MentionedUser.username })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 3,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Example_Mention"), i18n.__("Give_SecondArgumentExample"), i18n.__("Give_ThirdArgumentExample")]
  }

  return helpEmbed(message, i18n, Options)
}
