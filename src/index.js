const Discord = require("discord.js")
const Env = require("dotenv")
Env.config()

const Bot = new Discord.Client()
const Keys = process.env
const { Message, Ready } = require("./events")

Bot.on("message", (message) => {
  try {
    if (!Message.condition(message, Keys, Bot)) {
      return
    }

    Message.run(message, Keys, Bot)
  } catch (e) {
    console.log(e)
  }
})

Bot.on("ready", () => {
  const { guildConfig } = require("./cache/index.js")
  const { isOnGuild, write } = require("./utils/index.js").CacheUtils
  const Guilds = Object.keys(guildConfig)
  let needsDataUpdate = false
  for (let i = 0; i < Guilds.length; i++) {
    if (isOnGuild(Bot, Guilds[i])) {
      continue
    }

    delete guildConfig[Guilds[i]]
    needsDataUpdate = true
  }

  if (needsDataUpdate) {
    write("guildConfig", guildConfig)
  }

  Ready.run(Bot, Keys)
})

Bot.login(Keys.TOKEN)
