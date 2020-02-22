const Cooldown = new Set()
const CooldownWarning = new Set()

/**
 * Adds the id to a Set that gets cleared after 3 seconds
 * @function
 * @param {string} id - The user Id
 * @returns {number} - 0 If the user just entered the cooldown, 4 if the user tried to use a command while in cooldown or 3 if the user got warned that it tried to use a command while in cooldown.
 */
module.exports.applyCooldown = (id) => {
  const ApplyCooldownWarning = () => {
    CooldownWarning.add(id)

    setTimeout(() => {
      CooldownWarning.delete(id)
    }, 3000)
  }

  if (CooldownWarning.has(id)) {
    return 3
  }

  if (Cooldown.has(id)) {
    ApplyCooldownWarning()

    return 4
  }

  Cooldown.add(id)
  setTimeout(() => {
    Cooldown.delete(id)
  }, 3000)

  return 0
}
