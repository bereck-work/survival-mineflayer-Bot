import { Bot, BotEvents } from 'mineflayer'
import { data } from "../index"

/**
 * @param {Bot} bot // to enable intellisense
 */

module.exports = (bot: Bot) => {
  bot.addChatPattern('hello', /<(.+)> (?:Hello|hello)/, { parse: true, repeat: false })

  bot.on('chat:hello' as keyof BotEvents, ([[username]]: [string]): void => {
    if ( data.owner.toLowerCase() === username.toLowerCase()){
    bot.chat(`Hi, ${username}, my sweet darling.`)
    } else {
      bot.chat(`Hello,  ${username}, my name is ${data.username}`)
    }
  })
}
