const Repository = require('./base.repository')
const ticketModel = require('../models/ticket.model')

class TicketManager extends Repository {
    constructor(){
        super(ticketModel)
    }
}

module.exports = new TicketManager()