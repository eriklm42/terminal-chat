import Events from 'events'
import CliConfig from './src/cliConfig.js';
import EventManager from './src/eventManager.js';
import SocketClient from './src/socker.js';
import TerminalController from "./src/terminalController.js";

const [...commands] = process.argv

const config = CliConfig.parseArguments(commands)

const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.start()
const eventManager = new EventManager({ componentEmitter, socketClient })
const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
    roomId: config.room,
    userName: config.username
}

eventManager.joinRoomAndWaitForMessages(data)

const controller = new TerminalController()
await controller.startTable(componentEmitter)