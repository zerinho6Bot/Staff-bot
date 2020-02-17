const { CacheUtils, LanguageUtils } = require("../utils/index.js")

exports.condition = ({ message, args, fastSend, fastEmbed, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  if (args.length < 2) {
    fastSend("Global_requiresArguments", false, { amount: 1 })
    return false
  }

  const GuildCoins = Profile.GuildCoins
  const Coins = Object.keys(GuildCoins)

  if (Coins.length > 0) {
    if (isNaN(args[1]) && args[1].length < 20 && GuildCoins[args[1]]) {
      const Coin = Profile.GuildCoin(args[1])
      fastEmbed.setTitle(`${args[1]} (${Coin.code})`)
      fastEmbed.setDescription(`${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.get(Coin.emoji).name}:${message.guild.emojis.get(Coin.emoji).id}>`} - _${i18n.__("Currency_coinValue", { value: Coin.value })}_`)
      fastSend(fastEmbed)
      return false
    }
  }

  if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Move_errorMissingPermission", false, { who: i18n.__("Global_You"), permission: "MANAGE_GUILD" })
    return false
  }

  const Choices = [i18n.__("Currency_Create"), i18n.__("Currency_Edit"), i18n.__("Currency_Delete")]
  if (!Choices.some((e) => args[1] === e)) {
    fastSend(`${i18n.__("Currency_errorOperatorsMustBe", { argument: i18n.__("Help_FirstArgument") })} ${Choices.join(", ")}`, true)
    return false
  }

  // ze.help 1 2 3 4 5
  switch (args[1].toLowerCase()) {
    case Choices[0]:
      if (args.length < 6) {
        fastSend("Currency_errorTheOperationNeedsArgs", false, { operation: i18n.__("Currency_Create"), amount: 4 })
        return false
      }
      break
    case Choices[1]:
      if (args.length < 5) {
        fastSend("Currency_errorTheOperationNeedsArgs", false, { operation: i18n.__("Currency_Edit"), amount: 3 })
        return false
      }
      break
    default:
      if (args.length < 3) {
        fastSend("Currency_errorTheOperationNeedsArgs", false, { operation: i18n.__("Currency_Delete"), amount: 1 })
        return false
      }
      break
  }
  return true
}

exports.run = ({ message, args, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const Choices = [i18n.__("Currency_Create"), i18n.__("Currency_Edit"), i18n.__("Currency_Delete")]
  switch (args[1]) {
    case Choices[0]:
      exports.create({ message, args, fastSend, Profile, i18n })
      break
    case Choices[1]:
      exports.edit({ message, args, fastSend, Profile, i18n })
      break
    default:
      exports.delete({ message, fastSend, args, Profile, i18n })
      break
  }
}

exports.create = ({ message, args, fastSend, Profile, i18n }) => {
  // ze.currency create kekCoin 200 KEK :kekwhatthefuck:

  if (Object.keys(Profile.GuildCoins).length >= Profile.maxGuildCoins) {
    fastSend("Currency_errorMaxGuildCoins", false, { amount: Profile.maxGuildCoins })
    return
  }

  const AllOperations = LanguageUtils.profileOperationAllLanguages()
  if (!isNaN(args[2]) || args[2].length > Profile.lengthLimit || args[2].length <= 0 || AllOperations.some((elem) => args[2].toLowerCase() === elem)) {
    fastSend("Currency_errorInvalidCoinName", false, { argument: i18n.__("Help_SecondArgument") })
    return
  }

  if (Profile.GuildCoin(args[2])) {
    fastSend("Currency_errorCoinExists", false, { argument: i18n.__("Help_SecondArgument") })
    return
  }

  if (isNaN(args[3]) || args[3] > 66666 || args[3] < 1) {
    fastSend("Currency_errorInvalidCoinValue", false, { argument: i18n.__("Help_ThirdArgument") })
    return
  }

  if (!isNaN(args[4]) || args[4].length > 4 || args[4].length <= 2) {
    fastSend("Currency_errorInvalidCoinCode", false, { argument: i18n.__("Help_FourthArgument") })
    return
  }

  if (isNaN(args[5]) || (args[5].length > 18 || args[5].length < 16) || message.guild.emojis.has(args[5]) === undefined) {
    fastSend("Currency_errorInvalidCoinEmoji", false, { argument: i18n.__("Help_FifthArgument") })
    return
  }

  Profile.GuildCoins[args[2]] = Profile.DefaultCoinProperties
  const Coin = Profile.GuildCoin(args[2])
  Coin.code = args[4]
  Coin.emoji = args[5]
  Coin.value = parseInt(args[3])
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Currency_coinCreated", false, { name: args[2], code: args[4], emoji: args[5], value: args[3] })
}

exports.edit = ({ message, args, fastSend, Profile, i18n }) => {
  // ze.currency edit kekMoney [code, emoji, value] newValue
  if (Object.keys(Profile.GuildCoins).length <= 0) {
    fastSend("Currency_errorNoGuildCoin")
    return
  }

  if (!isNaN(args[2]) || args[2].length > Profile.lengthLimit || args[2].length <= 0) {
    fastSend("Currency_errorInvalidCoinName", false, { argument: i18n.__("Help_SecondArgument") })
    return
  }

  if (!Profile.GuildCoin(args[2])) {
    fastSend("Currency_errorCoinDontExist", false, { argument: i18n.__("Help_ThirdArgument") })
    return
  }

  const EditOperations = [i18n.__("Currency_code"), i18n.__("Currency_emoji"), i18n.__("Currency_value")]
  if (!isNaN(args[3]) || !EditOperations.some((elem) => args[3] === elem)) {
    fastSend(`${i18n.__("Currency_errorInvalidEditOperation", { argument: i18n.__("Help_FourthArgument") })} ${EditOperations.join(", ")}`, true)
    return
  }

  switch (args[3]) {
    case i18n.__("Currency_code"):
      if (!isNaN(args[4]) || args[4].length > 4 || args[4].length <= 2) {
        fastSend("Currency_errorInvalidCoinCode", false, { argument: i18n.__("Help_FourthArgument") })
        return
      }
      Profile.GuildCoin(args[2]).code = args[4]
      break
    case i18n.__("Currency_emoji"):
      if (isNaN(args[4]) || (args[4].length > 18 || args[4].length < 16) || !message.guild.emojis.has(args[4])) {
        fastSend("Currency_errorInvalidCoinEmoji", false, { argument: i18n.__("Help_FourthArgument") })
        return
      }
      Profile.GuildCoin(args[2]).emoji = args[4]
      break
    default:
      if (isNaN(args[4]) || args[4] > 66666 || args[4] < 1) {
        fastSend("Currency_errorInvalidCoinValue", false, { argument: i18n.__("Help_FourthArgument") })
        return
      }
      Profile.GuildCoin(args[2]).value = parseInt(args[4])
      break
  }

  fastSend("Currency_editedCoin", false, { coin: args[2], property: args[3], newProperty: args[4] })
  CacheUtils.write("guildConfig", Profile.guildConfig)
}

exports.delete = ({ fastSend, args, Profile, i18n }) => {
  // ze.currency delete kekMoney
  if (Object.keys(Profile.GuildCoins).length <= 0) {
    fastSend("Currency_errorNoGuildCoin")
    return
  }

  if (!isNaN(args[2]) || args[2].length > 20 || args[2].length <= 0) {
    fastSend("Currency_errorInvalidCoinCode", false, { argument: i18n.__("Help_SecondArgument") })
    return
  }

  if (!Profile.GuildCoin(args[2])) {
    fastSend("Currency_errorCoinDontExist", false, { argument: i18n.__("Help_SecondArgument") })
    return
  }

  delete Profile.GuildCoins[args[2]]

  if (Object.keys(Profile.GuildBank).length > 0) {
    const Users = Object.keys(Profile.GuildBank)
    for (let i = 0; i < Users.length; i++) {
      const UserCoins = Object.keys(Profile.UserWallet(Users[i]))

      for (let e = 0; e < UserCoins.length; e++) {
        if (UserCoins[e] === args[2]) {
          delete Profile.GuildBank[Users[i]].wallet[UserCoins[e]]
        }
      }
    }
  }
  CacheUtils.write("guildConfig", Profile.guildConfig)
  fastSend("Currency_deleteCoin", false, { coin: args[2] })
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 5,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Currency_FirstArgumentExample"), i18n.__("Currency_SecondArgumentExample"), i18n.__("Currency_ThirdArgumentExample"), i18n.__("Currency_FourthArgumentExample"), i18n.__("Currency_FifthArgumentExample")]
  }

  return helpEmbed(message, i18n, Options)
}
