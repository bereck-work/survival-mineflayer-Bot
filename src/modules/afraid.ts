import mineflayer from "mineflayer";
import { settings } from "../index";

/**

@param {mineflayer.Bot}
*/

module.exports = (bot: mineflayer.Bot) => {
  
  function search_for_monsters() {
    // @ts-ignore
    let entity = bot.nearestEntity((entity) => entity.type === "hostile");

    if (!entity) {
      if (!settings.isAfraid) return;

      bot.deactivateItem();
      settings.isAfraid = false;

      bot.chat("exhales heavily");
      return;
    }

    if (entity.position.distanceTo(bot.entity.position) <= 20) {
      if (settings.isAfraid) return;
      bot.activateItem();
      settings.isAfraid = true;

      bot.chat("Hey darling, there are monsters near here.");
    } else {
      if (!settings.isAfraid) return;

      bot.deactivateItem();
      settings.isAfraid = false;

      bot.chat("Looks like they went away.");
    }
  }

  setInterval(search_for_monsters, 3000);
};
