const fs = require('fs/promises')
const path = require('path')

class ChatManager {
    #messages = []

    constructor(){
        this.filepath = path.join(__dirname, '../data', 'messages.json')
    }

    #readFile = async() => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#messages = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#messages, null, 2)
        await fs.writeFile(this.filepath, data)
    }

    async getAll(){
        await this.#readFile()
        return this.#messages
    }
    async create(message) {
        await this.#readFile()

        const newId = Date.now().toString()
        message._id = newId;

        this.#messages.push(message)

        await this.#writeFile()

        return message
    }

    async update(id, message) {
        await this.#readFile()

        const messageIndex = this.#messages.findIndex(m => m._id === id)

        if (messageIndex !== -1) {
            this.#messages[messageIndex] = { ...this.#messages[messageIndex], ...message }
            await this.#writeFile()
            return this.#messages[messageIndex]
        } else {
            throw new Error('Message not found')
        }
    }

    async delete(id) {
        await this.#readFile()

        const initialLength = this.#messages.length;
        this.#messages = this.#messages.filter(message => message._id !== id)

        if (this.#messages.length < initialLength) {
            await this.#writeFile()
            return true
        } else {
            throw new Error('Message not found')
        }
    }
}

module.exports = new ChatManager()