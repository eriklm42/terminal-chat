import ComponentsBuilder from "./components"
import { constants } from "./constants"

export default class TerminalController {
    #usersCollors = new Map()

    constructor() { }

    #pickCollor() {
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserCollor(userName) {
        if (this.#usersCollors.has(userName)) return this.#usersCollors.get(userName)

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }

    #onINputReceived(eventEmitter) {
        return function () {
            const message = this.getValue()
            eventEmitter.emit(constants.events.app.MESSAGE_SENT, message)
            this.clearValue()
        }
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserCollor(userName)
            chat.addItem(`{${collor}{bold}${userName}{/}: ${message}}`)
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${String(msg)}{/}`)
            screen.render()
        }
    }

    #onStatusChanged({ screen, status }) {
        return users => {
            const { content } = status.item.shift()
            status.clearItems()
            status.addItem(content)
            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            })

            screen.render()
        }
    }

    async startTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({ titile: "Terminal Chat" })
            .setLayoutComponent(this.#onINputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
    }
}