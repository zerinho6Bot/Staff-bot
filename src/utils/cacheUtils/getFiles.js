const Cache = require("../../cache/index.js")

/**
 * Retuns the files listed on cache/index.js
 * @function
 * @returns {Array<String>}
 */
module.exports.getFiles = () => {
  return Object.keys(Cache)
}
