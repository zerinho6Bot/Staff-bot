/**
 * Retuns a pre-built embed with varius informations about the command
 * @function
 * @param {Object} message
 * @param {Object} i18n
 * @param {Object} Options - Informations about the command
 * @param {number} Options.argumentsLength - How many arguments the command can have
 * @param {boolean} Options.argumentsNeeded - If the arguments that the command can have are needed for the command to run
 * @param {Array<string>} Options.argumentsFormat - A format example of each argument that the command can have.
 * @returns {Object} - The pre-built embed
 */
module.exports.helpEmbedFactory = (message, i18n, { argumentsLength, argumentsNeeded, argumentsFormat }) => {
  const Embed = require("./index").FastEmbed(message)
  const CallerId = require("caller-id")
  const FileName = CallerId.getData().filePath.split("commands")[1].replace(/.js/gi, "").substring(1)

  const ArgumentsRequired = ["Help_NoArgument", "Help_OneArgument", "Help_TwoArguments", "Help_ThreeArguments", "Help_FourArguments", "Help_FiveArguments", "Help_SixArguments"]
  Embed.addField(i18n.__("Help_Info"), i18n.__("Help_ArgumentsRequired", { howMany: i18n.__(ArgumentsRequired[argumentsLength]), required: i18n.__(argumentsNeeded ? "Global_Yes" : "Global_No") }))

  if (argumentsFormat.length > 0) {
    let formats = ""
    const ArgumentsIndex = ["Help_FirstArgument", "Help_SecondArgument", "Help_ThirdArgument", "Help_FourthArgument", "Help_FifthArgument"]

    for (let i = 0; i < argumentsFormat.length; i++) {
      formats += `° ${i18n.__(ArgumentsIndex[i])}: ${argumentsFormat[i]}\n`
    }
    Embed.addField(i18n.__("Help_ArgumentsFormat"), formats)
  }

  Embed.setTitle(i18n.__(`Literal_${FileName}`))
  Embed.setDescription(i18n.__(`${FileName}_description`))

  return Embed
}
