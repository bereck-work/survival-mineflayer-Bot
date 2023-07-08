import mineflayer, { Bot } from "mineflayer";
import { sleep } from "../utils/helpers";
import { ConfigManager } from "./config";
import { BotSettingsState, BotData } from "../utils/interfaces";
import chalk from "chalk";
import { pathfinder } from "mineflayer-pathfinder";

class MineflayerBot {
  private bot: Bot;
  public bot_settings: BotSettingsState = {
    isLoggedIn: false,
    isSpawned: false,
    isAfraid: false,
    isSneaking: false,
    isCooking: false,
    isSleeping: false,
    isFollowing: false,
    isLooking: false,
    hasFood: false,
    willCook: false,
    hasFuel: false,
  };
  private data: BotData = {
    username: "Alexia",
    boatID: "",
    armor: [
      "leggings",
      "chestplate",
      "helmet",
      "boots",
      "cap",
      "tunic",
      "pants",
      "shield",
      "totem",
      "sword",
    ],
    armor_destinations: {
      helmet: "head",
      cap: "head",

      chestplate: "torso",
      tunic: "torso",

      leggings: "legs",
      pants: "legs",

      boots: "feet",

      shield: "off-hand",
      totem: "off-hand",

      sword: "hand",
    },
    cookable: [
      "raw rabbit",
      "raw chicken",
      "raw porkchop",
      "raw mutton",
      "raw beef",

      "potato",

      "raw cod",
      "raw salmon",
    ],
    cooked: [
      "cooked rabbit",
      "cooked chicken",
      "cooked porkchop",
      "cooked mutton",
      "steak",

      "baked potato",

      "cooked cod",
      "cooked salmon",
    ],
    armor_slots: ["head", "torso", "legs", "feet"],
    owner: "Bereck",
    health: 20,
    goal: 0,
    pvp: 0,
  };

  constructor() {
    const credentials = new ConfigManager().readConfig();

    this.bot = mineflayer.createBot({
      username: "Alexia",
      host: "survbot.ploudos.me",
      version: "1.19.4",
      port: 25565,
    });

    this.bot_settings.isLoggedIn = false;
    this.bot_settings.hasFood = false;
    this.bot_settings.isCooking = false;
    this.bot_settings.willCook = false;
    this.bot_settings.isAfraid = false;
    this.bot_settings.isSneaking = false;

    
    this.bot.loadPlugin(pathfinder);

    this.bot.once("spawn", async () => {
      console.log(chalk.green("Starting mineflayer bot..."));
      await sleep(100);
      console.log(
        chalk.green(
          `Logged in to minecraft server!\n name: ${
            credentials.host
          }\n version: ${
            credentials.version
          }\n port: ${credentials.port.toString()}`
        )
      );
    });

    this.bot.once("login", () => {
      this.bot_settings.isLoggedIn = true;
    });

    this.bot.once("spawn", () => {
      this.bot_settings.isSpawned = true;
    });

    this.bot.on("kicked", async (reason) => {
      console.log(
        chalk.red(`The bot has been kicked from the server!\nReason: ${reason}`)
      );
    });

    this.bot.on("error", async (error) => {
      console.log(
        chalk.red(
          `Error occurred while logging into minecraft server!\nReason: ${error.message}`
        )
      );
    });
  }

  public getBotInstance(): Bot {
    return this.bot;
  }

  public getSettings(): BotSettingsState {
    return this.bot_settings;
  }

  public getBotData(): BotData {
    return this.data;
  }
}

export { MineflayerBot };
