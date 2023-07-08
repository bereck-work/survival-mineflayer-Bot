import mineflayer, { BotEvents } from "mineflayer";
import { sleep } from "../utils/helpers";
import { goals } from "mineflayer-pathfinder"
import { BotFurnace } from "../core/abi";
import { settings, data } from "../index";
import chalk from "chalk";
/**

@param {mineflayer.Bot}
*/
module.exports = (bot: mineflayer.Bot) => {

    let furnace = new BotFurnace();
    const furnace_block = furnace.findFurnace();
    console.log(furnace_block)

    if (!furnace_block) return;

    settings.isCooking = true;

    console.log(`Found a furnace, at ${furnace_block.position}`);

    let goal = new goals.GoalGetToBlock(
      furnace_block.position.x,
      furnace_block.position.y,
      furnace_block.position.z
    );

    settings.isLooking = false;
    settings.isFollowing = false;

    bot.pathfinder.setGoal(goal);

    bot.once("goal_reached" as keyof BotEvents, async (_: any): Promise<void> => {

      await sleep(2000);

      bot.lookAt(furnace_block.position);

      console.log("Reached the furnace.");

      bot.openFurnace(furnace_block).then(async (furnace: any) => {
        await sleep(10000);

        if (furnace.inputItem() === null) {
          let item = bot.inventory
            .items()
            .find((temp: any) =>
              data.cookable.includes(temp.displayName.toLowerCase())
            );

          furnace.putInput(item?.type, null, item?.count);

          console.log(`${item?.name} in furnace`);

          settings.hasFood = false;
        }

        await sleep(2000);

        if (furnace.fuelItem() === null) {
          let item = bot.inventory
            .items()
            .find(
              (temp: any) =>
                temp.displayName.includes("Coal") ||
                temp.displayName.includes("Charcoal")
            );
          furnace.putFuel(item?.type, null, item?.count);
          settings.hasFuel = false;

          await sleep(2000);
          console.log(chalk.green(`${item?.name} in furnace`));
        }

        let interval = setInterval(async () => {
          if (furnace.inputItem() === null) {
            clearInterval(interval);

            if (furnace.fuelItem()) {
              furnace.takeOutput();
              settings.hasFuel = true;
            }

            await sleep(3000);

            furnace.takeFuel();
            console.log("Food is finished!");
            settings.isCooking = false;
          }
        }, 1000);
      });
    });

  bot.on("playerCollect", async (collector: any, collected: any) => {
    if (collector.username !== bot.username) return;
    if (settings.hasFood && settings.hasFuel) return;

    let item = collected.getDroppedItem();

    if (!item) return;

    if (item.name === "coal" || item.name === "charcoal") {
      if (settings.hasFuel) return;

      console.log(`Picked up ${item.displayName}`);
      settings.hasFuel = true;

      if (!settings.hasFood) {
        bot.chat("Got some fuel, waiting for food to start cooking.");
        console.log(chalk.yellow("Got some fuel, waiting for food to start cooking."));
        return;
      }

      bot.chat("Got some fuel, looking for furnace to cook with.");
      settings.willCook = true;
      return;
    }

    if (data.cookable.includes(item.displayName.toLowerCase())) {
      console.log(`Picked up ${item.displayName}`);

      if (settings.hasFood) return;

      settings.hasFood = true;

      if (!settings.hasFuel) {
        bot.chat("Got some food, waiting to get some fuel (Coal or Charcoal)");
        return;
      }

      bot.chat("Got some food, looking for furnace to cook with.");
      settings.hasFood = true;
      return;
    }
  });

  setInterval(furnace.player_furnace_ability_checks, 5000);
};
