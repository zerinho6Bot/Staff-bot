const { CacheUtils } = require('../utils/index.js')

exports.condition = ({ args, message, fastSend, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)

  if (Profile.ProfileDisabledForGuild()) {
    fastSend('Currency_errorProfileNotEnabled')
    return false
  }

  if (!Profile.GuildData) {
    fastSend('Buy_errorGuildHasNoData')
    return false
  }
  // ze.iteminfo [role, tag] itemName
  if (args.length < 3) {
    fastSend('Global_requiresArguments', false, { amount: 2 })
    return false
  }

  if (!isNaN(args[1]) || ![i18n.__('Buy_roleLiteral'), i18n.__('Buy_tagLiteral')].includes(args[1].toLowerCase())) {
    fastSend('Iteminfo_errorInvalidItemType', false, { argument: i18n.__('Help_FirstArgument') })
    return false
  }

  const SearchFor = args[1] === i18n.__('Buy_roleLiteral') ? 'roles' : 'tags'

  if (!Profile.FindGuildSelling(SearchFor)) {
    fastSend('Iteminfo_errorNotSellingType', false, { itemType: SearchFor === 'roles' ? i18n.__('Buy_roleLiteral') : i18n.__('Buy_tagLiteral') })
    return false
  }

  const ItemName = args[2].replace(/\s+/g, '')
  if (!Profile.FindGuildItem(SearchFor, ItemName)) {
    fastSend('Iteminfo_errorCouldFindItem', false, { argument: i18n.__('Help_SecondArgument') })
    return false
  }

  return true
}

exports.run = ({ args, message, fastSend, fastEmbed, i18n }) => {
  const Profile = new CacheUtils.Profile(message.guild)
  const FixedItemName = args[2].replace(/\s+/g, '')
  const Item = Profile.FindGuildItem(args[1].toLowerCase() === i18n.__('Buy_roleLiteral') ? 'roles' : 'tags', FixedItemName)
  fastEmbed.setTitle(FixedItemName)
  if (Item.description) {
    fastEmbed.setDescription(Item.description)
  }
  fastEmbed.addField(i18n.__('Help_Info'), i18n.__('Iteminfo_showItemInfo', { value: Item.value, coin: Item.coin }))
  fastSend(fastEmbed, true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 2,
    argumentsNeeded: true,
    argumentsFormat: [i18n.__('Buy_itemTypeExample'), i18n.__('Iteminfo_SecondArgument')]
  }

  return helpEmbed(message, i18n, Options)
}
