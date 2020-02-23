/**
 * Retuns if the bot is on the given guild
 * @function
 * @param {Object} bot
 * @param {String} guildId - The guild id that you want to check if the bot is on.
 * @returns {Boolean}
 */
module.exports.isOnGuild = (bot, guildId) => {
  return bot.guilds.has(guildId)
}
