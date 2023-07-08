import * as fs from 'fs';

interface ServerConfig {
  host: string,
  port: number,
  username: string,
  owner: string,
  version: string,
}


interface ServerConfig {
  host: string;
  port: number;
  username: string;
  owner: string;
  version: string;
}

class ConfigManager {
  private configFilePath = '/home/dev1ce/Progamming/survival-bot/src/config.json';

  readConfig(): ServerConfig {
    try {
      const fileContent = fs.readFileSync(this.configFilePath, 'utf-8');
      return JSON.parse(fileContent) as ServerConfig;
    } catch (error) {
      console.error('Error reading config file:', error);
      return {
        host: 'survbot.ploudos.me',
        port: 25565,
        username: 'Alexia',
        owner: 'Bereck',
        version: '1.19.4'
      };
    }
  }

  writeConfig(config: ServerConfig): void {
    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(config, null, 2), 'utf-8');
      console.log('Config file has been updated.');
    } catch (error) {
      console.error('Error writing config file:', error);
    }
  }
}


export { ConfigManager };
