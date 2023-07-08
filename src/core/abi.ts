import { Player } from "mineflayer";
import { goals } from "mineflayer-pathfinder";
import chalk from "chalk";
import { settings, mineflayer_bot_instance as bot, data } from "../index";

class Follow {
  moveToGoal(player: Player) {
    const goal = new goals.GoalNear(
      player.entity.position.x,
      player.entity.position.y,
      player.entity.position.z,
      3
    );

    if (!data.goal) {
      bot.pathfinder.setGoal(goal);
      data.goal = goal;
      return;
    }

    if (goal.x === data.goal.x && goal.z === data.goal.z) return;

    bot.pathfinder.setGoal(null);
    bot.pathfinder.setGoal(goal);
    data.goal = goal;
    console.log(
      "Successfully set goal, pathfinder has started to trace to the goal."
    );
  }

  start() {
    if (!settings.isFollowing) return;

    const player = bot.players[data.owner];

    if (!player) return;
    if (!player.entity) return;

    if (!bot.pathfinder.isMoving) {
      bot.pathfinder.setGoal(null);
    }

    if (player.entity.position.distanceTo(bot.entity.position) > 16) {
      console.log(
        chalk.green(
          `${bot.entity.position} away from ${player.entity.position}, sprinting towards the player`
        )
      );
      bot.setControlState("sprint", true);
      this.moveToGoal(player);
      return;
    }

    if (player.entity.position.distanceTo(bot.entity.position) < 6) {
      bot.setControlState("sprint", false);

      // @ts-ignore
      if (player.entity.metadata[6] === 5) {
        bot.setControlState("sneak", true);
        bot.activateItem(true);
      } else {
        bot.setControlState("sneak", false);
        bot.deactivateItem();
      }
      this.moveToGoal(player);
      return;
    }
  }

  stop() {
    console.log(chalk.yellow("Stopping..."));

    bot.pathfinder.setGoal(null);
    bot.setControlState("sneak", true);
    bot.activateItem(true);
    return;
  }
}

class BotFurnace {
  player_furnace_ability_checks() {
    if (settings.isSleeping) return;
    if (settings.isCooking) return;
    if (!settings.hasFuel) return;
    if (!settings.hasFood) return;
    if (!settings.willCook) return;
  }

  findFurnace() {
    console.log(chalk.bgYellowBright("Looking for furnaces... "));

    try {
      let block = bot.findBlock({
        matching: (furnace: any) =>
          furnace.displayName.includes("Furnace") ||
          furnace.displayName.includes("Smoker"),
      });
      if (block) {
        console.log(chalk.greenBright(`Found furnace: ${block.displayName}`));
        return block;
      } else {
        return false;
      }
    } catch (e) {
      console.log(chalk.bgRedBright("Couldn't find furnace..."));
      return false;
    }
  }
}

export { Follow, BotFurnace };
