import mineflayer from "mineflayer";
import { Movements } from "mineflayer-pathfinder";
import { settings, data } from "../index"
/**

@param {mineflayer.Bot}
*/


module.exports = (bot: mineflayer.Bot) => {
  bot.on("spawn", () => {

    let movements = new Movements(bot);

    movements.canDig = false;
    movements.allow1by1towers = false;
    movements.canOpenDoors = true;

    bot.pathfinder.setMovements(movements);

    let items = bot.inventory
      .items()
      .filter(
        (item) =>
          item.displayName.includes("Coal") ||
          item.displayName.includes("Charcoal")
      );

    if (items.length !== 0) {
      if (!settings.hasFood) {
        console.log("There is fuel, waiting for cookable food.");
      } else {
        console.log("There is fuel and cookable food. Watching for furnaces.");
        settings.willCook = true;
      }
      settings.hasFuel = true;
    }

    items = bot.inventory
      .items()
      .filter((item) => data.cookable.includes(item.displayName.toLowerCase()));

    if (items.length !== 0) {
      if (!settings.hasFuel) {
        console.log("There is cookable food, waiting for fuel.");
      } else {
        console.log("There is cookable food and fuel. Watching for furnaces.");
        settings.willCook = true;
      }

      settings.hasFood = true;
    }
  });
};
