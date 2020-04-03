exports.run = (bot, keys, log) => {
  const Activity = `My prefix is ${keys.PREFIX}`
  console.log('Ready')
  Log.info("Bot's ready.")
  bot.user.setActivity(Activity).then(() => {
    console.log(`Activity is now: "${Activity}"`)
  })
}
