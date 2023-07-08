import mineflayer, { BotEvents } from 'mineflayer';
import { sleep } from '../utils/helpers'
import { settings, data } from "../index"
import chalk from 'chalk';
/**

@param {mineflayer.Bot}
*/


module.exports = (bot: mineflayer.Bot) => {
  bot.addChatPattern(
    'throw',
    new RegExp(
      `<${data.owner}> (throw|Throw) (all$|All$|storage$|Storage$|armor$|Armor$|shield$|Shield$|food$|Food$|totem$|Totem$)`,
    ),
    { parse: true, repeat: false }
  );

  bot.on('chat:throw' as keyof BotEvents, async ([[_, action]]: [string]): Promise<void> => {
    if (action.toLowerCase() === 'all') {
      console.log('Throwing everything.');
      const items = bot.inventory.items();

      for (const item of items) {
        if (item.displayName.includes('Coal') || item.displayName.includes('Charcoal')) {
          settings.hasFuel = false;
        }

        if (data.cookable.includes(item.displayName.toLowerCase())) {
          settings.hasFood = false;
        }

        bot.equip(item, null);
        await sleep(1000);
        bot.tossStack(item);
      }
    }

    if (action.toLowerCase() === 'storage') {
      console.log('Throwing storage.');

      const items = bot.inventory.items();
      for (const item of items) {
        // See if the items are not part of the storage.
        if (item.displayName.includes('Coal') || item.displayName.includes('Charcoal')) continue;
        if (data.cookable.includes(item.displayName.toLowerCase())) continue;

        bot.equip(item, null);
        await sleep(1000);
        bot.tossStack(item);
      }
    }

    if (action.toLowerCase() === 'food') {
      const items = bot.inventory.items();
      for (const item of items) {
        // See if the items are not part of the storage.
        if (item.displayName.includes('Coal') || item.displayName.includes('Charcoal')) continue;
        if (data.cookable.includes(item.displayName.toLowerCase())) continue;

        if (data.cooked.includes(item.displayName.toLowerCase())) {
          bot.equip(item, null);
          await sleep(1000);
          bot.tossStack(item);
        }
      }
    }

    if (action.toLowerCase() === 'armor') {
      console.log('Throwing armor.');

      for (const destination of data.armor_slots) {
       //@ts-ignore
        bot.unequip(destination);
        await sleep(500);
      }

      for (const item of bot.inventory.items()) {
        for (const equip of data.armor) {
          if (item.displayName.toLowerCase().includes(equip)) {
            bot.equip(item, null);
            await sleep(500);
            bot.tossStack(item);
            console.log(`Threw ${item.displayName}`);
          }
        }
      }
    }

    if (action.toLowerCase() === 'shield' || action.toLowerCase() === 'totem') {
      bot.unequip('off-hand');

      await sleep(500);

      const shield = bot.inventory.items().find(
        (item) => item.displayName === 'Shield' || item.displayName === 'Totem of Undying',
      );

      if (shield === undefined) {
        return console.log(`there is no ${action}`);
      }

      bot.equip(shield, null);
      await sleep(500);
      bot.tossStack(shield);

      console.log(chalk.green(`Threw ${shield.displayName}`));
    }
  });
};
