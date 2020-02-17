const { CacheUtils } = require("../utils/index.js")
const Moment = require("moment")
Moment.locale("en")

exports.condition = ({ message, fastSend }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  return true
}

exports.run = ({ message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const Coins = Profile.GuildCoins
  const CoinsName = Object.keys(Coins)
  const CollectedCoins = []
  let requiresUpdate = false
  let createdToday = false

  if (CoinsName.length <= 0) {
    fastSend("Currency_errorNoGuildCoin")
    return
  }

  if (!Profile.UserBank(message.author.id)) {
    Profile.GuildBank[message.author.id] = Profile.DefaultBankProperties
    createdToday = true
    requiresUpdate = true
  }

  const UserBank = Profile.UserBank(message.author.id)
  const TimeDifference = new Date().getTime() - new Date(UserBank.lastDaily).getTime()
  const DaysDifference = (TimeDifference) / (1000 * 3600 * 24)

  if (DaysDifference > 1 || createdToday) {
    for (let i = 0; i < CoinsName.length; i++) {
      if (!UserBank.wallet[CoinsName[i]]) {
        UserBank.wallet[CoinsName[i]] = Profile.DefaultMoneyProperties
      }
      UserBank.wallet[CoinsName[i]].holds += Profile.GuildCoin(CoinsName[i]).value
      CollectedCoins.push(CoinsName[i])
      requiresUpdate = true
    }
    UserBank.lastDaily = new Date().getTime()
  }

  if (requiresUpdate) {
    CacheUtils.write("guildConfig", Profile.guildConfig)
  }

  let collectedCoinsStr = ""
  for (let i = 0; i < CollectedCoins.length; i++) {
    const Coin = Coins[CollectedCoins[i]]
    collectedCoinsStr += `${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.get(Coin.emoji).name}:${message.guild.emojis.get(Coin.emoji).id}>`}${Coin.code} +**${Coin.value}**\n`
  }

  if (collectedCoinsStr.length <= 0) {
    const TimeSinceLastDaily = Moment(UserBank.lastDaily).fromNow()
    const Time = TimeSinceLastDaily.includes("second") ? i18n.__("Daily_seconds") : TimeSinceLastDaily.includes("minute") ? i18n.__("Daily_minutes") : TimeSinceLastDaily.includes("hour") ? i18n.__("Daily_hours") : i18n.__("Daily_userForgorTheBotExists")
    const Amount = (TimeSinceLastDaily.includes("few") || TimeSinceLastDaily.includes("some")) ? i18n.__("Daily_few") : TimeSinceLastDaily.replace(/[^0-9]/g, "")
    fastSend("Daily_errorNoCoinToCollect", false, { amount: Amount, time: Time })
    return
  }
  fastSend(collectedCoinsStr, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 0,
    argumentsNeeded: false,
    argumentsFormat: []
  }

  return helpEmbed(message, i18n, Options)
}
