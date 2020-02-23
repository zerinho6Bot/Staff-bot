exports.condition = ({ message, args, fastSend, keys }) => {
  if (message.author.id !== keys.OWNER) {
    fastSend("Eval_errorOnlyOwner")
    return false
  }
  // st.eval code
  if (args.length < 2) {
    fastSend("Eval_errorMissingCode")
    return false
  }

  return true
}

exports.run = async ({ message, args, fastEmbed, fastSend, i18n, keys }) => {
  const FullArgs = args.splice(2, args.length - 1).join(" ")
  const Result = async () => {
    try {
      // eslint-disable-next-line no-eval
      const Result = await eval(FullArgs)
      return Result
    } catch (e) {
      return e.toString()
    }
  }

  const FinalResult = await Result()

  fastEmbed.addField(i18n.__("Eval_code"), `\`\`\`Javascript\n${FullArgs}\n\`\`\``)
  fastEmbed.addField(i18n.__("Eval_result"), FinalResult)

  fastSend(fastEmbed)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__("eval_firstArgumentExample")]
  }

  return helpEmbed(message, i18n, Options)
}
