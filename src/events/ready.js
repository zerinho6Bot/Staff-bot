exports.run = (bot, keys, log) => {
  const Activity = `My prefix is ${keys.PREFIX}`
  console.log("Ready")
  log.info("Bot's ready.")
  bot.user.setActivity(Activity).then(() => {
    console.log(`Activity is now: "${Activity}"`)
  })
}
