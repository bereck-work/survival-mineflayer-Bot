import { MineflayerBot } from "./core/bot";
import mineflayer from "mineflayer";
import path from "path";
import fs from "fs";
import { pathfinder } from "mineflayer-pathfinder";
import { plugin } from "mineflayer-pvp";
import { BotData, BotSettingsState } from "./utils/interfaces";

function createBot(): {
  bot: MineflayerBot;
  settings: BotSettingsState;
  mineflayer_bot_instance: mineflayer.Bot;
  data: BotData;
} {
  const bot = new MineflayerBot();
  const settings = bot.getSettings();
  const mineflayer_bot_instance = bot.getBotInstance();
  const data = bot.getBotData();

  return { bot, settings, mineflayer_bot_instance, data };
}

export const { bot, settings, mineflayer_bot_instance, data } = createBot();

mineflayer_bot_instance.loadPlugin(pathfinder);
mineflayer_bot_instance.loadPlugin(plugin);

export const pvp = plugin;

function injectModules(bot: mineflayer.Bot) {
  const MODULES_DIRECTORY = path.join(__dirname, "modules");
  const modules = fs
    .readdirSync(MODULES_DIRECTORY) // find the plugins
    .filter((x) => x.endsWith(".js")) // only use .js files
    .map((pluginName) => require(path.join(MODULES_DIRECTORY, pluginName)));

  console.log(modules);

  bot.loadPlugins(modules);
  console.log(`Loaded ${modules.length} modules`);
}

injectModules(mineflayer_bot_instance);
