const { CacheUtils, DateUtils } = require("../utils/index.js")

exports.condition = ({ message, fastSend }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend("Currency_errorProfileNotEnabled")
    return false
  }

  return true
}

exports.run = ({ message, fastSend, i18n, log }) => {
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
    log.trace("Creating bank for user ", message.author.id)
    Profile.GuildBank[message.author.id] = Profile.DefaultUserBankProperties
    createdToday = true
    requiresUpdate = true
  }

  const UserBank = Profile.UserBank(message.author.id)
  const DateClass = new DateUtils.Date(UserBank.lastDaily)

  if (DateClass.isOldDay || createdToday) {
    log.trace("The user ", message.author.id, " was created today or passed a day.")
    for (let i = 0; i < CoinsName.length; i++) {
      if (!UserBank.wallet[CoinsName[i]]) {
        UserBank.wallet[CoinsName[i]] = Profile.DefaultMoneyProperties
      }
      UserBank.wallet[CoinsName[i]].holds += Profile.GuildCoin(CoinsName[i]).value
      CollectedCoins.push(CoinsName[i])
      requiresUpdate = true
    }
    log.trace("Defined user ", message.author.id, " lastDaily to ", new Date().getTime().toString())
    UserBank.lastDaily = new Date().getTime()
  }

  if (requiresUpdate) {
    log.log("Updated guildConfig.")
    CacheUtils.write("guildConfig", Profile.guildConfig)
  }

  let collectedCoinsStr = ""
  for (let i = 0; i < CollectedCoins.length; i++) {
    const Coin = Coins[CollectedCoins[i]]
    collectedCoinsStr += `${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.get(Coin.emoji).name}:${message.guild.emojis.get(Coin.emoji).id}>`}${Coin.code} +**${Coin.value}**\n`
  }

  if (collectedCoinsStr.length <= 0) {
    const DateClass = new DateUtils.Date(UserBank.lastDaily)
    const TimeSinceLastDaily = DateClass.fromNow
    // const Time = TimeSinceLastDaily.includes("seconds") ? i18n.__("Daily_seconds") : TimeSinceLastDaily.includes("minutes") ? i18n.__("Daily_minutes") : TimeSinceLastDaily.includes("hours") ? i18n.__("Daily_hours") : i18n.__("Daily_userForgotTheBotExists")
    const Amount = TimeSinceLastDaily.replace(/[^0-9]/g, "")
    const Time = () => {
      const InPlural = Amount === 1 ? "" : "s"

      const BasicTimes = ["day", "month", "year"]

      if (BasicTimes.some((elem) => TimeSinceLastDaily.includes(elem))) {
        const Time = (TimeSinceLastDaily.replace(/([0-9])/g, "")).replace(/\s+/g, "").replace("-", "")
        // Yes, I'm bad at regex, please help me.
        return i18n.__(`Daily_${Time}${InPlural}`)
      } else {
        const SplitTime = TimeSinceLastDaily.split(" ")
        const Hour = SplitTime[0]
        const Minute = SplitTime[2]
        const Second = SplitTime[4]
        const HourStr = Hour === 1 ? i18n.__("Daily_hour") : i18n.__("Daily_hours")
        const MinuteStr = Minute === 1 ? i18n.__("Daily_minute") : i18n.__("Daily_minutes")
        const SecondStr = Second === 1 ? i18n.__("Daily_second") : i18n.__("Daily_seconds")

        return i18n.__("Daily_errorNoCoinToCollectSameDay", { time: `${Hour} ${HourStr} ${Minute} ${MinuteStr} ${Second} ${SecondStr}` })
      }
    }
    log.trace("User ", message.author.id, " has no coin to collect, timestamp is ", new Date().getTime().toString(), " his last daily was ", TimeSinceLastDaily)
    if (Time().includes(i18n.__("Daily_second"))) {
      fastSend(Time(), true)
    } else {
      fastSend("Daily_errorNoCoinToCollect", false, { amount: Amount, time: Time() })
    }
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
