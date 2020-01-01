const Cache = require("../cache/index.js")

module.exports.getFiles = () => {
  return Object.keys(Cache)
}

module.exports.write = (file, content) => {
  const Files = exports.getFiles()
  if (!Files.includes(file)) {
    console.log(`${file} does not exist on cache directory, files that exist: ${Files.join(", ")}`)
    return false
  }

  const Fs = require("fs")
  Fs.writeFile(`./cache/${file}.json`, JSON.stringify(content, null, 4), (e) => {
    if (e) {
      console.log(e)
    }

    try {
      delete require.cache[require.resolve(`../cache/${file}.json`)]
    } catch (e) {
      console.log(e)
    }
  })
  return true
}
