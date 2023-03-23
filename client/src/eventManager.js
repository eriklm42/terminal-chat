import { constants } from "./constants";

export default class EventManager {
    #allUsers = new Map()

    constructor({ componentEmitter, scoketClient }) {
        this.componentEmitter = componentEmitter,
            this.scoketClient = scoketClient
    }

    joinRoomAndWaitForMessages(data) {
        this.scoketClient.sendMessage(constants.events.socket.JOIN_ROOM, data)
        this.componentEmitter.on(constants.events.app.MESSAGE_SENT, msg => {
            this.scoketClient.sendMessage(constants.events.socket.MESSAGE, msg)
        })
    }

    updateUsers(users) {
        const connectedUsers = users
        connectedUsers.forEach(({ id, userName }) => this.#allUsers.set(id, userName))
        this.#updateUsersComponent()
    }

    disconnectUser(user) {
        const { userName, id } = user
        this.#allUsers.delete(id)

        this.#updateActivityLogComponent(`${userName} left!`)
        this.#updateUsersComponent()
    }

    message(message) {
        this.componentEmitter.emit(
            constants.events.app.MESSAGE_RECEIVED,
            message
        )
    }

    newUserConnected(message) {
        const user = message
        this.#allUsers.set(user.id, user.userName)
        this.#updateUsersComponent()
        this.#updateActivityLogComponent(`${user.userName} joined!`)
    }

    #updateActivityLogComponent(message) {
        this.componentEmitter.emit(
            constants.events.app.ACTIVITYLOG_UPDATED,
            message
        )
    }

    #updateUsersComponent() {
        this.componentEmitter.emit(
            constants.events.app.STATUS_UPDATED,
            Array.from(this.#allUsers.values())
        )
    }

    getEvents() {
        const functions = Reflect.ownKeys(EventManager.prototype)
            .filter(fn => fn !== "constructor")
            .map(name => [name, this[name].bind(this)])

        return new Map(functions)
    }
}
