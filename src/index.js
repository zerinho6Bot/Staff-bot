const Discord = require("discord.js")
const Env = require("dotenv")
Env.config()

const Path = require("path")
const Bot = new Discord.Client()
const Keys = process.env
const { Message, Ready } = require("./events")
const Log = require("simple-node-logger").createSimpleLogger({ logFilePath: Path.join(__dirname, "./cache/log.txt") })

Bot.on("message", (message) => {
  try {
    if (!Message.condition(message, Keys, Bot, Log)) {
      return
    }

    Log.trace("Message id: ", message.id, " passed conditions with the content: ", message.content)
    Message.run(message, Keys, Bot, Log)
  } catch (e) {
    Log.warn("Error while trying to run, info: ", e.toString)
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
    Log.warn("Bot isn't on guild: ", Guilds[i], " anymore, deleting data.")
    delete guildConfig[Guilds[i]]
    needsDataUpdate = true
  }

  if (needsDataUpdate) {
    write("guildConfig", guildConfig)
  }

  Ready.run(Bot, Keys, Log)
})

Bot.login(Keys.TOKEN)
