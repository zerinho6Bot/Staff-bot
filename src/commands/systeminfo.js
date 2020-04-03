const { LanguageUtils } = require('../utils')
exports.run = ({ bot, keys, message, fastSend, i18n, fastEmbed }) => {
  fastEmbed.addField('Discord.js', require('discord.js').version, true)
  fastEmbed.addField(i18n.__('Systeminfo_guilds'), bot.guilds.cache.size, true)
  fastEmbed.addField(i18n.__('Systeminfo_users'), bot.users.cache.size, true)
  fastEmbed.addField(i18n.__('Systeminfo_defaultLanguage'), LanguageUtils.fallbackLanguage, true)
  fastEmbed.addField(i18n.__('Systeminfo_ramUsage'), `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB(RSS)`, true)
  fastEmbed.addField(i18n.__('Systeminfo_uptime'), `${Math.floor(process.uptime() / 3600 % 24)}:${Math.floor(process.uptime() / 60 % 60)}:${Math.floor(process.uptime() % 60)}`, true)
  fastEmbed.addField(i18n.__('Serverinfo_owner'), keys.OWNER, true)

  fastSend(fastEmbed, true)
}
