const LOCAL_URL = "http://localhost:9898"
const defaultRoom = "1"

export default class CliConfig {
  constructor({ username, hostUri = LOCAL_URL, room = defaultRoom }) {
    this.username = username
    this.room = room

    const { hostname, port, protocol } = new URL(hostUri);

    this.host = hostname;
    this.port = port;
    this.protocol = protocol.replace(/\W/, '');
  }

  static parseArguments(commands) {
    const cmd = new Map();
    for (const key in commands) {
      const index = parseInt(key);
      const command = commands[key];
      const commandPreffix = "--";

      console.log({ index, command });
      if (!command.includes(commandPreffix)) continue;
      cmd.set(command.replace(commandPreffix, ""), commands[index + 1]);
    }

    console.log({ cmd });

    return new CliConfig(Object.fromEntries(cmd));
  }
}
