/**
 * Writes in a cache file.
 * @param {String} file - One of the files listed on cache/index.js
 * @param {Object} content - The content that'll be writen to the file.
 * @returns {Boolean} - If the action had success.
 */
module.exports.write = (file, content) => {
  const CacheUtils = require("./index.js")
  const Files = CacheUtils.getFiles()
  const Path = require("path")

  if (!Files.includes(file)) {
    Log.info(`${file} does not exist on cache directory, files that exist: ${Files.join(", ")}`)
    return false
  }

  const Fs = require("fs")
  Fs.writeFile(Path.join(__dirname, `../../cache/${file}.json`), JSON.stringify(content, null, 2), (e) => {
    Log.info(`Trying to get file ${file}`)
    if (e) {
      Log.warn("Couldn't get file, error: " + e.toString())
    }

    try {
      Log.info("Trying to delete file cache.")
      delete require.cache[require.resolve(Path.join(__dirname, `../../cache/${file}.json`))]
    } catch (e) {
      Log.warn("Could clear cache, error: " + e.toString())
    }
  })
  return true
}
