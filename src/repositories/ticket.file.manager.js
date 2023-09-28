const fs = require('fs/promises')
const path = require('path')

class TicketManager {
    #tickets = []

    constructor(){
        this.filepath = path.join(__dirname, '../data', 'tickets.json')
    }

    #readFile = async() => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#tickets = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#tickets, null, 2)
        await fs.writeFile(this.filepath, data)
    }

    async create(ticket) {
        await this.#readFile()

        const newId = Date.now().toString()
        ticket._id = newId

        this.#tickets.push(ticket)

        await this.#writeFile()
        
        return ticket
    }
}

module.exports = new TicketManager()