const Cache = require("../cache/index.js")

/*
      DO NOT VSCODE FORMAT THIS CODE
      ESLINT WILL BE _MAD_ BECAUSE
      IT'LL REMOVE THE SPACES BEFORE
      THE PROFILE CLASS FUNCTIONS
      PARENTHESES, IF YOU'RE GOING
      TO FORMAT, FORMAT ONLY IN
      SELECTION
*/

/**
 * Retuns the files listed on cache/index.js
 * @function
 * @returns {Array<String>}
 */
module.exports.getFiles = () => {
  return Object.keys(Cache)
}

/**
 * Retuns if the bot is on the given guild
 * @function
 * @param {Object} bot
 * @param {String} guildId - The guild id that you want to check if the bot is on.
 * @returns {Boolean}
 */
module.exports.isOnGuild = (bot, guildId) => {
  return bot.guilds.has(guildId)
}

/**
 * The profile class for the currency commands.
 * @class
 * @param {Object} guild - A guild Object
 */
module.exports.Profile = class {
  constructor (guild) {
    this.guild = guild
    this.guildConfig = Cache.guildConfig
    this.lengthLimit = 20
    this.maxGuildCoins = 5
  }

  /**
   * Gets if the profile is disabled on the guild.
   * @function
   * @param {String} [guildId] - The guild id
   * @returns {Boolean}
   */
  ProfileDisabledForGuild (guildId = this.guild.id) {
    if (!this.guildConfig[guildId]) {
      return false
    }

    return !this.guildConfig[guildId].profile
  }

  /**
   * Gets the guild data.
   * @returns {Object}
   */
  get GuildData () {
    if (this.ProfileDisabledForGuild()) {
      return null
    }

    return this.guildConfig[this.guild.id]
  }

  /**
   * Gets the guild bank.
   * @returns {Object}
   */
  get GuildBank () {
    if (this.ProfileDisabledForGuild()) {
      return null
    }

    return this.GuildData.profile.currency.bank
  }

  /**
   * Gets the guild coins.
   * @returns {Object}
   */
  get GuildCoins () {
    if (this.ProfileDisabledForGuild()) {
      return null
    }

    return this.GuildData.profile.currency.coins
  }

  /**
   * Gets a coin object from the guild coins.
   * @function
   * @param {String} coin - The coin name.
   * @returns {Object}
   */
  GuildCoin (coin) {
    if (typeof coin !== "string" || coin.length > this.lengthLimit || this.ProfileDisabledForGuild()) {
      return null
    }

    const GuildCoins = this.GuildCoins

    if (!GuildCoins || Object.keys(GuildCoins).length <= 0 || !GuildCoins[coin]) {
      return null
    }

    return GuildCoins[coin]
  }

  /**
   * Gets the guild default profile properties.
   * @returns {Object}
   */
  get GuildDefaults () {
    if (this.ProfileDisabledForGuild()) {
      return null
    }

    return this.GuildData.defaultConfig
  }

  /**
   * Sets the default guild description.
   * @param {String} newValue - The new description
   * @returns {String}
   */
  set GuildDescription (newValue) {
    // 2048 = discord embed description limit

    if (this.ProfileDisabledForGuild() || typeof newValue !== "string" || newValue > 2048 || !this.GuildDefaults) {
      return ""
    }

    this.GuildDefaults.description = newValue
    return this.GuildDefaults.description
  }

  /**
   * Sets the default guild background.
   * @param {String} newValue - The new background
   * @returns {String}
   */
  set GuildBackground (newValue) {
    if (this.ProfileDisabledForGuild() || typeof newValue !== "string" || !this.GuildDefaults) {
      return ""
    }

    this.GuildDefaults.background = newValue
    return this.GuildDefaults.background
  }

  /**
   * Gets the guild sales.
   * @returns {Object}
   */
  get GuildSales () {
    if (this.ProfileDisabledForGuild()) {
      return null
    }

    return this.GuildData.profile.currency.inSale
  }

  /**
   * Gets a object of itens on the itemType
   * @function
   * @param {String} itemType - roles or tags.
   * @returns {Object}
   */
  FindGuildSelling (itemType) {
    if (typeof itemType !== "string" || this.ProfileDisabledForGuild() || !["roles", "tags"].some((elem) => itemType === elem)) {
      return null
    }

    return this.GuildSales[itemType]
  }

  /**
   * Gets the user bank.
   * @function
   * @param {String} userId
   * @returns {Object}
   */
  UserBank (userId) {
    if (this.ProfileDisabledForGuild() || Object.keys(this.GuildBank).length <= 0 || !this.GuildBank[userId]) {
      return null
    }

    return this.GuildBank[userId]
  }

  /**
   * Gets the user wallet.
   * @function
   * @param {String} userId
   * @returns {Object}
   */
  UserWallet (userId) {
    if (this.ProfileDisabledForGuild() || !this.UserBank(userId)) {
      return null
    }

    return this.UserBank(userId).wallet
  }

  /**
   * Gets the user coins.
   * @function
   * @param {String} userId
   * @returns {Array<String>}
   */
  UserCoins (userId) {
    if (this.ProfileDisabledForGuild() || !this.UserBank(userId)) {
      return null
    }

    return Object.keys(this.UserWallet(userId))
  }

  /**
   * Gets the user inventory
   * @function
   * @param {String} userId
   * @returns {Object}
   */
  UserInventory (userId) {
    if (this.ProfileDisabledForGuild() || !this.UserBank(userId)) {
      return null
    }

    return this.UserBank(userId).inventory
  }

  /**
   * Gets a array of itens of the given itemType from user inventory.
   * @param {String} userId - The user Id
   * @param {String} itemType - The item type
   * @returns {Array<String>}
   */
  FromUserInventory (userId, itemType) {
    if (this.ProfileDisabledForGuild() || !["roles", "tags"].some((elem) => itemType === elem) || !this.UserInventory(userId)) {
      return null
    }

    return this.UserInventory(userId)[itemType]
  }

  /**
   * Gets a item from the guild sellings.
   * @param {String} itemType - The item type
   * @param {String} itemName - The item name
   * @returns {Object}
   */
  FindGuildItem (itemType, itemName) {
    if (this.ProfileDisabledForGuild() || !["roles", "tags"].some((elem) => itemType === elem) || !this.FindGuildSelling(itemType)) {
      return null
    }

    const TypeSales = this.FindGuildSelling(itemType)

    if (!Object.keys(TypeSales).includes(itemName)) {
      return null
    }

    return TypeSales[itemName]
  }

  get DefaultRoleProperties () {
    return {
      coin: "",
      value: 0,
      roleId: ""
    }
  }

  get DefaultTagProperties () {
    return {
      coin: "",
      value: 0,
      description: ""
    }
  }

  get DefaultCoinProperties () {
    return {
      code: "",
      emoji: "",
      value: 0
    }
  }

  get DefaultMoneyProperties () {
    return {
      holds: 0
    }
  }

  get DefaultUserBankProperties () {
    return {
      lastDaily: new Date().getTime(),
      wallet: {},
      inventory: {
        roles: [],
        tags: []
      }
    }
  }

  get DefaultProfileProperties () {
    return {
      clan: "",
      background: "",
      description: ""
    }
  }

  get DefaultGuildProperties () {
    return {
      language: "",
      profile: {
        enabled: false,
        currency: {
          coins: {
            zerinhoMoney: {
              code: "ZRM",
              emoji: "💰",
              value: 369
            }
          },
          bank: {/*
        "userid": {
          lastDaily: Date,
          wallet: {
            "zerinhoMoney": {
              holds: number
            }
          },
          inventory: {
            roles: [],
            tags: []
          }
        }
       */},
          inSale: {
            roles: {
              /*
              "roleid": {
                cost: {
                  coin: coinName,
                  value: number
                  roleId: number
                }
              }
            */
            },
            tags: {
              /*
              "tagname": {
                coin: coinName,
                value: number
              }
              */
            }
          }
        },
        defaultConfig: {
          background: "https://cdn.glitch.com/07a1e29d-d555-46aa-9758-a9cb10390ccd%2F1_pBZ1aL7UcriEesvddpPOFg.png?1540839899884",
          description: "Hi, I'm a awesome user!"
        }
      }
    }
  }
}

/**
 * Writes in a cache file.
 * @param {string} file - One of the files listed on cache/index.js
 * @param {Object} content - The content that'll be writen to the file.
 * @returns {boolean} - If the action has sucess.
 */
module.exports.write = (file, content) => {
  const Files = exports.getFiles()
  if (!Files.includes(file)) {
    console.log(`${file} does not exist on cache directory, files that exist: ${Files.join(", ")}`)
    return false
  }

  const Fs = require("fs")
  Fs.writeFile(`./cache/${file}.json`, JSON.stringify(content, null, 2), (e) => {
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
