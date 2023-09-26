const Repository = require('./base.repository')
const chatModel = require('../models/chat.model')

class ChatRepository extends Repository {
    constructor(){
        super(chatModel)
    }
}

module.exports = new ChatRepository()