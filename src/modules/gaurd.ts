import { Bot, BotEvents } from "mineflayer";
import { Movements, goals as pathfinderGoals } from "mineflayer-pathfinder";

module.exports = (bot: Bot) => {
  bot.addChatPattern("gaurd", /<(.+)> (?:gaurd$|Gaurd$)/, {
    parse: true,
    repeat: false,
  });

  let guardPos: any = null;
  let isGaurding = false;

  // Assign the given location to be guarded
  function guardArea(pos: any) {
    guardPos = pos;

    // If we are not currently in combat, move to the guard pos
    if (!bot.pvp.target) {
      moveToGuardPos();
    }
  }

  // Cancel all pathfinder and combat
  function stopGuarding() {
    guardPos = null;
    bot.pvp.stop();
    bot.pathfinder.setGoal(null);
  }

  // Pathfinder to the guard position
  function moveToGuardPos() {
    bot.pathfinder.setMovements(new Movements(bot));
    bot.pathfinder.setGoal(
      new pathfinderGoals.GoalBlock(guardPos.x, guardPos.y, guardPos.z)
    );
  }

  // Called when the bot has killed its target.
  bot.on("stoppedAttacking" as keyof BotEvents, () => {
    if (guardPos) {
      moveToGuardPos();
    }
  });

  // Check for new enemies to attack
  bot.on("physicsTick", () => {
    if (!guardPos) return; // Do nothing if bot is not guarding anything

    // Only look for mobs within 16 blocks
    const filter = (e: any) =>
      e.type === "mob" &&
      e.position.distanceTo(bot.entity.position) < 16 &&
      e.mobType !== "Armor Stand"; // Mojang classifies armor stands as mobs for some reason?

    const entity = bot.nearestEntity(filter);
    if (entity) {
      // Start attacking
      bot.pvp.attack(entity);
    }
  });

  // Listen for player commands
  bot.on("chat:gaurd" as keyof BotEvents, ([[username]]: [string]): void => {
    // Guard the location the player is standing
    const player = bot.players[username];

    if (!player) {
      bot.chat("I can't see you.");
      return;
    }

    bot.chat("I will guard that location.");
    guardArea(player.entity.position);
    isGaurding = true;
  });

  bot.on("chat:stop" as keyof BotEvents, ([[_]]: [string]): void => {
    if (isGaurding) {
      bot.chat("I am already in gaurding mode.");
      return;
    } else {
      stopGuarding();
      bot.chat("I will no longer guard that location.");
      return;
    }
  });
};
