import { Bot, BotEvents } from 'mineflayer';
import { sleep } from '../utils/helpers';
import { data } from "../index"
import chalk from 'chalk';

/**
 * @param {mineflayer.Bot} bot
 */

module.exports = (bot: Bot) => {
  
  bot.on("playerCollect" as keyof BotEvents, async (collector: any, collected: any): Promise<void> => {
    
    await sleep(2000);
    if (collector.username !== bot.username) return;

    const item = collected.getDroppedItem();

    if (!item) return;

    for (const armor of data.armor) {
      if (item.displayName.toLowerCase().includes(armor)) {
        // @ts-ignore
        const item = bot.inventory.items().find(
          (temp) => temp.displayName === item.displayName
        );

        await sleep(2000);

        // @ts-ignore
        bot.equip(item, data.armor_destinations[armor]);

        console.log(chalk.greenBright(`Bot has equipped ${item.displayName}`));
        return;
      }
    }
  });
};
