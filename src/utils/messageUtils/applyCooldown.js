const Cooldown = new Set()
const CooldownWarning = new Set()

/**
 * Adds the id to a Set that gets cleared after 3 seconds.
 * @function
 * @param {String} id - The user Id
 * @returns {Number} - 0 If the user just entered the cooldown, 4 if the user tried to use a command while in cooldown or 3 if the user got warned that it tried to use a command while in cooldown.
 */
module.exports.applyCooldown = (id) => {
  const ApplyCooldownWarning = () => {
    Log.info(`Applying cooldown for user(${id})`)
    CooldownWarning.add(id)

    setTimeout(() => {
      Log.info(`Removing cooldown for user(${id})`)
      CooldownWarning.delete(id)
    }, 3000)
  }

  if (CooldownWarning.has(id)) {
    Log.info(`User(${id}) is trying to use commands too fast after warning about it...`)
    return 3
  }

  if (Cooldown.has(id)) {
    Log.info(`User(${id}) is trying to use commands too fast! Putting it into cooldown warning.`)
    ApplyCooldownWarning()

    return 4
  }

  Log.info(`Adding cooldown to user(${id})`)
  Cooldown.add(id)
  setTimeout(() => {
    Log.info(`Deleting cooldown for user(${id})`)
    Cooldown.delete(id)
  }, 3000)

  return 0
}
