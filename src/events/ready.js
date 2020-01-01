exports.run = (bot, keys) => {
  const Activity = `My prefix is ${keys.PREFIX}`
  console.log("Ready")
  bot.user.setActivity(Activity).then(() => {
    console.log(`Activity is now: "${Activity}"`)
  })
}
