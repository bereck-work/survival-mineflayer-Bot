import { Bot, BotEvents } from 'mineflayer'

/**
 * @param {Bot} bot // to enable intellisense
 */

module.exports = (bot: Bot) => {
  bot.addChatPattern('hello', /<(.+)> (?:Hello|hello)/, { parse: true, repeat: false })

  bot.on('chat:hello' as keyof BotEvents, ([[username]]: [string]): void => {
    bot.chat(`Hi, ${username}, my sweet darling.`)
  })
}
