import mineflayer, { BotEvents } from 'mineflayer';
import { settings, data } from '../index';
import { Follow } from '../core/abi';
import chalk from 'chalk'
import { sleep } from 'src/utils/helpers';

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot: mineflayer.Bot) => {

  const follow = new Follow();

  bot.on('physicsTick', follow.start);

  bot.addChatPattern('follow', /<(.+)> (follow$|Follow$)/, { parse: true, repeat: false });

  bot.addChatPattern('stay', /<(.+)> (stay$|Stay$)/, { parse: true, repeat: false });

  bot.on("chat:stay" as keyof BotEvents, ([[username]]: [string]): void => {
    if (username !== data.owner) return;

    if (!settings.isFollowing) {
     bot.chat('I am already with you darling, hehe...');
      return;
    }

    bot.chat('Oooooh okay, I will stay here quietly, darling.');
    settings.isFollowing = false;

    follow.stop();
  });

  bot.on("entityAttach", (entity, ride) => {

    if (!entity.username) return;

    if (entity.username.toLowerCase() !== data.owner.toLowerCase()) return

    if (ride.displayName == "Boat") {
        data.boatID = ride.id
        console.log(chalk.greenBright("My owner just rode a boat....."))
    }
})

bot.on("entityDetach", async (entity, ride) => {

    if (!entity.username) return;

    if (entity.username.toLowerCase() !== data.owner.toLowerCase()) return

    if (ride.displayName == "Boat") {
        data.boatID = false;
        console.log("My owner just got down from the boat")

        if (!settings.isFollowing) return;
        
        bot.setControlState("sneak", true)
        await sleep(200)
        bot.setControlState("sneak", false)
        
        settings.isFollowing = true;
        settings.isLooking = true;
    }
})

  bot.on('chat:follow' as keyof BotEvents, ([[username]]: [string]): void => {
    if (username !== data.owner) return;

    if (settings.isFollowing) {
      bot.chat(`I am already following ${username}`);
      return;
    }

    bot.chat('I am coming, love.');
    bot.setControlState('sneak', false);
    bot.deactivateItem();
    follow.start();

    settings.isFollowing = true;
    settings.isLooking = true;
  });
};
