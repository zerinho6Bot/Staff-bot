const { profiles } = require("../cache/index.js")
const { CacheUtils } = require("../utils/index.js")

exports.condition = async ({ message, args, fastSend }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    if (!message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
      fastSend("Currency_errorProfileNotEnabled")
      return false
    }

    fastSend("Profile_enablingSystem")
    if (!Profile.GuildData) {
      Profile.guildConfig[message.guild.id] = Profile.DefaultGuildProperties
    }
    Profile.guildConfig[message.guild.id].profile.enabled = true
    CacheUtils.write("guildConfig", Profile.guildConfig)
    return false
  }

  if (args.length <= 2 && args[1] === "disable" && message.guild.member(message.author.id).hasPermission("MANAGE_GUILD")) {
    fastSend("Profile_disablingSystem")
    Profile.guildConfig[message.guild.id].profile.enabled = false
    CacheUtils.write("guildConfig", Profile.guildConfig)
    return false
  }

  const CheckFor = message.mentions.users.size > 0 ? message.mentions.users.first().id : message.author.id
  if (!profiles[CheckFor]) {
    profiles[CheckFor] = Profile.DefaultProfileProperties
    await CacheUtils.write("profiles", profiles)
  }

  return true
}

exports.run = ({ message, fastEmbed, fastSend, i18n }) => {
  const GuildProfile = new CacheUtils.Profile(message.guild)
  const Guild = GuildProfile.GuildData
  const FromUser = message.mentions.users.size > 0 ? message.mentions.users.first() : message.author
  const Profile = profiles[FromUser.id]
  const User = {
    background: Profile.background.length <= 0 ? Guild.profile.defaultConfig.background : Profile.background,
    description: Profile.description.length <= 0 ? Guild.profile.defaultConfig.description : Profile.description
  }

  fastEmbed.setImage(User.background)
  fastEmbed.setDescription(User.description)
  fastEmbed.setThumbnail(FromUser.displayAvatarURL)
  fastEmbed.setAuthor(`${FromUser.tag}${Profile.clan.length > 0 ? ` [${Profile.clan}]` : ""}`, FromUser.displayAvatarURL)

  if (GuildProfile.UserBank(FromUser.id) && Object.keys(GuildProfile.UserWallet(FromUser.id)).length > 0) {
    const MoneyString = () => {
      const Coins = Object.keys(GuildProfile.UserWallet(FromUser.id))
      let str = ""
      for (let i = 0; i < Coins.length; i++) {
        const Coin = GuildProfile.GuildCoin(Coins[i])
        str += `${isNaN(Coin.emoji) ? Coin.emoji : `<:${message.guild.emojis.get(Coin.emoji).name}:${message.guild.emojis.get(Coin.emoji).id}>`} ${Coin.code}: ${GuildProfile.UserWallet(FromUser.id)[Coins[i]].holds} `
      }

      return str
    }

    fastEmbed.addField(i18n.__("Profile_serverEconomy"), MoneyString())
  }

  const UserTags = GuildProfile.UserBank(FromUser.id) ? GuildProfile.UserInventory(FromUser.id).tags : null

  if (UserTags && UserTags.length > 0) {
    fastEmbed.addField(i18n.__("Buy_Tags"), "``" + UserTags.join("``, ``") + "``")
  }

  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("Example_Mention")]
  }

  return helpEmbed(message, i18n, Options)
}
