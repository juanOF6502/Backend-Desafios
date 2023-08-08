const chatModel = require('../models/chat.model')

class ChatManager {

    getAllMessages() {
        return chatModel.find().lean()
    }

    createMessage(message) {
        return chatModel.create(message)
    }
}

module.exports = new ChatManager()