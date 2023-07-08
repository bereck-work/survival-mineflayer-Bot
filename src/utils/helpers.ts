import type { Bot } from "mineflayer"
import path from "path"
import fs from "fs"

function injectModules(bot: Bot) {
    const MODULES_DIRECTORY = path.join(__dirname, 'modules')
    const modules = fs
      .readdirSync(MODULES_DIRECTORY) // find the plugins
      .filter((x) => x.endsWith('.js')) // only use .js files
      .map((pluginName) => require(path.join(MODULES_DIRECTORY, pluginName)))
  
    bot.loadPlugins(modules)
    console.log(`Loaded ${modules.length} modules`)
  }


  async function sleep(ms: number) {
    /**
     * An asynchronous function that pauses the execution of a program for a given amount of time, in milliseconds.
     *
     * @param ms: The amount of time to pause the execution of the program.
     * @returns A promise that resolves after the given amount of time.
     * @example
     * import { sleep } import 'sleep';
     *
     * async function sleep_function_example(foo: number){
     *     console.log(`The number that was passed in foo is ${foo}`);
     *     await sleep(foo);
     *     console.log(`This function slept for ${foo} milliseconds`);
     *     return;
     * };
     *
     * await sleep_function_example(13);
     **/
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export { sleep, injectModules };