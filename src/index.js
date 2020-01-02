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
  Ready.run(Bot, Keys)
})

Bot.login(Keys.TOKEN)
